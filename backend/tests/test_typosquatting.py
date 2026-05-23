import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.typosquatting import TyposquattingDetector

@pytest.mark.asyncio
async def test_detect_typosquatting_with_mock():
    mock_db = AsyncMock()
    mock_res = MagicMock()
    # Mock result to return tuple elements as SQLAlchemy would
    mock_res.all.return_value = [("octoclicks.co.id",), ("cimbniaga.co.id",)]
    mock_db.execute.return_value = mock_res
    
    detector = TyposquattingDetector()
    alerts = await detector.detect(["octoc1icks.co.id"], mock_db)
    
    assert len(alerts) == 1
    assert alerts[0].suspicious_domain == "octoc1icks.co.id"
    assert alerts[0].similar_to == "octoclicks.co.id"
    assert alerts[0].distance == 1

@pytest.mark.asyncio
async def test_exact_match_not_typosquatting():
    mock_db = AsyncMock()
    mock_res = MagicMock()
    mock_res.all.return_value = [("octoclicks.co.id",), ("cimbniaga.co.id",)]
    mock_db.execute.return_value = mock_res
    
    detector = TyposquattingDetector()
    alerts = await detector.detect(["octoclicks.co.id"], mock_db)
    
    assert len(alerts) == 0
