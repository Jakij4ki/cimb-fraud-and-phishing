from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from urllib.parse import urlparse
from app.models.whitelist import WhitelistURL, WhitelistPhone
from app.services.extractor import ExtractResult

class ComponentCheck(BaseModel):
    value: str
    is_whitelisted: bool
    whitelist_label: str | None
    normalized: str

class WhitelistResult(BaseModel):
    url_results: list[ComponentCheck]
    phone_results: list[ComponentCheck]
    email_results: list[ComponentCheck]
    has_unknown_component: bool
    risk_points: int

class WhitelistChecker:
    @staticmethod
    def _extract_domain(url: str) -> str:
        if not url.startswith('http'):
            url = 'http://' + url
        try:
            domain = urlparse(url).netloc
            return domain.lower().replace('www.', '')
        except:
            return url.lower()

    @staticmethod
    def _normalize_phone(phone: str) -> str:
        phone = phone.replace("-", "").replace(" ", "").replace("+", "")
        if phone.startswith("62"):
            phone = "0" + phone[2:]
        return phone

    async def check(self, components: ExtractResult, db: AsyncSession) -> WhitelistResult:
        url_results = []
        phone_results = []
        email_results = []
        has_unknown = False

        # URLs
        for url in components.urls:
            domain = self._extract_domain(url)
            stmt = select(WhitelistURL).where(WhitelistURL.domain == domain, WhitelistURL.is_active == True)
            res = await db.execute(stmt)
            whitelist_entry = res.scalar_one_or_none()
            
            is_whitelisted = whitelist_entry is not None
            if not is_whitelisted:
                has_unknown = True
            
            url_results.append(ComponentCheck(
                value=url,
                is_whitelisted=is_whitelisted,
                whitelist_label=whitelist_entry.label if whitelist_entry else None,
                normalized=domain
            ))

        # Phones
        for phone in components.phones:
            norm_phone = self._normalize_phone(phone)
            stmt = select(WhitelistPhone).where(WhitelistPhone.phone_number == norm_phone, WhitelistPhone.is_active == True)
            res = await db.execute(stmt)
            whitelist_entry = res.scalar_one_or_none()

            is_whitelisted = whitelist_entry is not None
            if not is_whitelisted:
                has_unknown = True
            
            phone_results.append(ComponentCheck(
                value=phone,
                is_whitelisted=is_whitelisted,
                whitelist_label=whitelist_entry.label if whitelist_entry else None,
                normalized=norm_phone
            ))

        # Emails
        for email in components.emails:
            domain = email.split('@')[-1] if '@' in email else email
            stmt = select(WhitelistURL).where(
                WhitelistURL.domain == domain.lower(), 
                WhitelistURL.category == 'email_domain', 
                WhitelistURL.is_active == True
            )
            res = await db.execute(stmt)
            whitelist_entry = res.scalar_one_or_none()

            is_whitelisted = whitelist_entry is not None
            if not is_whitelisted:
                has_unknown = True
            
            email_results.append(ComponentCheck(
                value=email,
                is_whitelisted=is_whitelisted,
                whitelist_label=whitelist_entry.label if whitelist_entry else None,
                normalized=domain
            ))

        risk_points = 80 if has_unknown else 0

        return WhitelistResult(
            url_results=url_results,
            phone_results=phone_results,
            email_results=email_results,
            has_unknown_component=has_unknown,
            risk_points=risk_points
        )
