import time
from app.services.weighted_scorer import calculate_score
from app.services.whitelist_checker import WhitelistResult, ComponentCheck

def test_unknown_component_nlp_phishing():
    wr = WhitelistResult(
        has_unknown_component=True,
        risk_points=80,
        url_results=[ComponentCheck(value="unknown.com", is_whitelisted=False, whitelist_label=None, normalized="unknown.com")],
        phone_results=[], email_results=[]
    )
    res = calculate_score(wr, {"is_phishing": True}, time.time())
    assert res.score == 100
    assert res.risk_level == "danger"

def test_unknown_component_nlp_not_phishing():
    wr = WhitelistResult(
        has_unknown_component=True,
        risk_points=80,
        url_results=[ComponentCheck(value="unknown.com", is_whitelisted=False, whitelist_label=None, normalized="unknown.com")], 
        phone_results=[], email_results=[]
    )
    res = calculate_score(wr, {"is_phishing": False}, time.time())
    assert res.score == 80
    assert res.risk_level == "danger"

def test_no_component_nlp_phishing():
    wr = WhitelistResult(
        has_unknown_component=False,
        risk_points=0,
        url_results=[], phone_results=[], email_results=[]
    )
    res = calculate_score(wr, {"is_phishing": True}, time.time())
    assert res.score == 100
    assert res.risk_level == "danger"

def test_known_component_nlp_not_phishing():
    wr = WhitelistResult(
        has_unknown_component=False,
        risk_points=0,
        url_results=[ComponentCheck(value="cimbniaga.co.id", is_whitelisted=True, whitelist_label="Official", normalized="cimbniaga.co.id")], 
        phone_results=[], email_results=[]
    )
    res = calculate_score(wr, {"is_phishing": False}, time.time())
    assert res.score <= 30
    assert res.risk_level == "safe"
