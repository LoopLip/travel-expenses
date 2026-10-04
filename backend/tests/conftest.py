"""Тесты работают с настоящим PostgreSQL, но в отдельной БД `<имя>_test` (создаётся автоматически)."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker

from app.config import settings
from app.db import Base, get_db
from app.main import app


def _prepare_test_database() -> str:
    url = make_url(settings.database_url)
    test_name = f"{url.database}_test"
    admin = create_engine(url.set(database="postgres"), isolation_level="AUTOCOMMIT")
    with admin.connect() as conn:
        exists = conn.scalar(text("SELECT 1 FROM pg_database WHERE datname = :n"), {"n": test_name})
        if not exists:
            conn.execute(text(f'CREATE DATABASE "{test_name}"'))
    admin.dispose()
    return url.set(database=test_name).render_as_string(hide_password=False)


@pytest.fixture(scope="session")
def engine():
    eng = create_engine(_prepare_test_database())
    yield eng
    eng.dispose()


@pytest.fixture()
def client(engine):
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

    def override_get_db():
        with Session() as s:
            yield s

    app.dependency_overrides[get_db] = override_get_db
    # Без контекстного менеджера lifespan не запускается: таблицы уже созданы выше.
    yield TestClient(app)
    app.dependency_overrides.clear()


# ---------- фабрики тестовых данных ----------
@pytest.fixture()
def make_user(client):
    def _make(email="ivanov@example.com", name="Иванов Иван"):
        r = client.post("/users", json={"full_name": name, "email": email, "department": "Продажи"})
        assert r.status_code == 201, r.text
        return r.json()

    return _make


@pytest.fixture()
def make_budget(client):
    def _make(limit="500000.00"):
        r = client.post("/budgets", json={"department": "Продажи", "period": "2026, Q4", "limit_amount": limit})
        assert r.status_code == 201, r.text
        return r.json()

    return _make


@pytest.fixture()
def make_trip(client, make_user, make_budget):
    def _make(planned="100000.00", **overrides):
        user = overrides.pop("user", None) or make_user()
        budget = overrides.pop("budget", None) or make_budget()
        payload = {
            "destination": "Казань",
            "purpose": "Конференция",
            "start_date": "2026-11-03",
            "end_date": "2026-11-06",
            "planned_amount": planned,
            "user_id": user["id"],
            "budget_id": budget["id"],
            **overrides,
        }
        r = client.post("/trips", json=payload)
        assert r.status_code == 201, r.text
        return r.json()

    return _make
