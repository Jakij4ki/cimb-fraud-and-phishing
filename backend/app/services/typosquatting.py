from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from Levenshtein import distance as levenshtein_distance
from app.models.whitelist import WhitelistURL
from urllib.parse import urlparse

class TyposquattingAlert(BaseModel):
    suspicious_domain: str
    similar_to: str
    distance: int
    suggestion: str
    explanation_id: str

class TyposquattingDetector:
    @staticmethod
    def _extract_domain(url: str) -> str:
        if not url.startswith('http'):
            url = 'http://' + url
        try:
            domain = urlparse(url).netloc
            return domain.lower().replace('www.', '')
        except:
            return url.lower()

    async def detect(self, urls: list[str], db: AsyncSession) -> list[TyposquattingAlert]:
        if not urls:
            return []

        # Get all whitelisted domains
        stmt = select(WhitelistURL.domain).where(WhitelistURL.is_active == True)
        res = await db.execute(stmt)
        whitelisted_domains = [row[0] for row in res.all()]

        alerts = []
        for url in urls:
            domain = self._extract_domain(url)
            if domain in whitelisted_domains:
                continue

            best_match = None
            min_dist = float('inf')

            for w_domain in whitelisted_domains:
                dist = levenshtein_distance(domain, w_domain)
                if dist < min_dist:
                    min_dist = dist
                    best_match = w_domain

            if 1 <= min_dist <= 3:
                alerts.append(TyposquattingAlert(
                    suspicious_domain=domain,
                    similar_to=best_match,
                    distance=min_dist,
                    suggestion=best_match,
                    explanation_id=f"Domain ini sangat mirip dengan {best_match} yang merupakan domain resmi bank, tetapi BUKAN yang asli. Selisihnya hanya {min_dist} karakter."
                ))
        
        # Sort by distance and return top 5
        alerts.sort(key=lambda x: x.distance)
        return alerts[:5]
