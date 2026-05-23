from app.schemas.analyze import AnalyzeRequest
import time
from app.services.weighted_scorer import calculate_score
from app.services.whitelist_checker import WhitelistResult, ComponentCheck

def test_analyze_request_valid():
    req = AnalyzeRequest(message_text="Cek link berikut http://test.com", message_type="SMS")
    assert req.message_text == "Cek link berikut http://test.com"
    assert req.message_type == "SMS"

def test_risk_level_mapping_safe():
    wr = WhitelistResult(has_unknown_component=False, risk_points=0, url_results=[], phone_results=[], email_results=[])
    res = calculate_score(wr, {"is_phishing": False}, time.time())
    assert res.score <= 30
    assert res.risk_level == "safe"



def test_risk_level_mapping_danger():
    wr = WhitelistResult(has_unknown_component=True, risk_points=80, url_results=[ComponentCheck(value="unknown.com", is_whitelisted=False, whitelist_label=None, normalized="unknown.com")], phone_results=[], email_results=[])
    res = calculate_score(wr, {"is_phishing": False}, time.time())
    assert 71 <= res.score <= 100
    assert res.risk_level == "danger"
