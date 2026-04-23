import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_api_root():
    response = client.get("/v1")
    assert response.status_code == 200
    assert "SIGQ API v1" in response.json()["message"]
