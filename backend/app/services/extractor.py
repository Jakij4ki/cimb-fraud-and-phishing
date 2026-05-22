import re
from pydantic import BaseModel
from app.core.security import sanitize_input

class ExtractResult(BaseModel):
    urls: list[str]
    phones: list[str]
    emails: list[str]
    raw_text: str
    has_components: bool

class MessageExtractor:
    def extract(self, text: str) -> ExtractResult:
        sanitized = sanitize_input(text)
        
        if not sanitized:
            return ExtractResult(urls=[], phones=[], emails=[], raw_text="", has_components=False)

        # URL Regex
        url_pattern = r'(?:https?://)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)'
        urls = re.findall(url_pattern, sanitized)
        valid_urls = [u for u in urls if "." in u and len(u) > 4]

        # Indonesian Phone Number Regex
        phone_pattern = r'(?:\+62|62|0)8[0-9]{1,2}[-\s]?[0-9]{3,4}[-\s]?[0-9]{3,5}|(?:140[0-9]{2}|150[0-9]{2,3}|1500[0-9]{3})'
        raw_phones = re.findall(phone_pattern, sanitized)
        phones = [re.sub(r'[-\s]', '', p) for p in raw_phones]

        # Email Regex
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = re.findall(email_pattern, sanitized)

        has_components = bool(valid_urls or phones or emails)

        return ExtractResult(
            urls=list(set(valid_urls)),
            phones=list(set(phones)),
            emails=list(set(emails)),
            raw_text=sanitized,
            has_components=has_components
        )
