from fastapi.testclient import TestClient

from app.main import app


def test_헬스체크는_ok를_돌려준다():
    res = TestClient(app).get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok", "service": "backend"}
