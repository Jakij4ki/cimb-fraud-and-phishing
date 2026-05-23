from app.services.extractor import MessageExtractor

def test_extract_url_with_protocol():
    extractor = MessageExtractor()
    res = extractor.extract("Silakan kunjungi https://contoh.com/path untuk info lebih lanjut")
    assert any("contoh.com/path" in u for u in res.urls) or any("https://contoh.com/path" in u for u in res.urls)
    assert res.has_components is True

def test_extract_domain_without_protocol():
    extractor = MessageExtractor()
    res = extractor.extract("Login di cimbniaga-login.com segera")
    assert "cimbniaga-login.com" in res.urls
    assert res.has_components is True

def test_extract_phone_08():
    extractor = MessageExtractor()
    res = extractor.extract("Hubungi 08123456789 sekarang")
    assert "08123456789" in res.phones

def test_extract_phone_62():
    extractor = MessageExtractor()
    res = extractor.extract("CS kami di +628123456789")
    # Regex returns +628123456789
    assert "+628123456789" in res.phones

def test_extract_email():
    extractor = MessageExtractor()
    res = extractor.extract("Email ke user@example.com")
    assert "user@example.com" in res.emails
