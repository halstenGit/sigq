import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import uuid4

from app.main import app
from app.core.database import Base, get_db, engine as main_engine
from app.core.config import settings

# Override database URL for testing
test_db_url = "sqlite:///./test_sigq.db"
test_engine = create_engine(test_db_url, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Create test database tables once"""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(autouse=True)
def clear_db():
    """Clear database before each test"""
    from sqlalchemy import delete
    from sqlalchemy.orm import Session

    db = TestingSessionLocal()
    for table in reversed(Base.metadata.sorted_tables):
        db.execute(delete(table))
    db.commit()
    db.close()
    yield


client = TestClient(app)


def test_criar_empreendimento():
    """Test creating a new empreendimento"""
    response = client.post(
        "/v1/empreendimentos",
        json={
            "nome": "Empreendimento Teste",
            "descricao": "Descrição de teste",
            "localizacao": "Joinville, SC",
            "id_sienge": "EMP-001",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["nome"] == "Empreendimento Teste"
    assert data["descricao"] == "Descrição de teste"
    assert data["ativo"] is True
    assert "id" in data
    assert "created_at" in data


def test_criar_empreendimento_minimo():
    """Test creating empreendimento with only required fields"""
    response = client.post(
        "/v1/empreendimentos",
        json={"nome": "Empreendimento Mínimo"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["nome"] == "Empreendimento Mínimo"
    assert data["descricao"] is None
    assert data["localizacao"] is None


def test_listar_empreendimentos_vazio():
    """Test listing empreendimentos when none exist"""
    response = client.get("/v1/empreendimentos")
    assert response.status_code == 200
    data = response.json()
    assert data == []


def test_listar_empreendimentos():
    """Test listing multiple empreendimentos"""
    # Create 3 empreendimentos
    for i in range(3):
        client.post(
            "/v1/empreendimentos",
            json={"nome": f"Empreendimento {i+1}"},
        )

    response = client.get("/v1/empreendimentos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert all("id" in item for item in data)
    assert all(item["ativo"] is True for item in data)


def test_listar_empreendimentos_com_paginacao():
    """Test listing with pagination"""
    # Create 5 empreendimentos
    for i in range(5):
        client.post(
            "/v1/empreendimentos",
            json={"nome": f"Empreendimento {i+1}"},
        )

    response = client.get("/v1/empreendimentos?skip=0&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

    response = client.get("/v1/empreendimentos?skip=2&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_obter_empreendimento():
    """Test getting a specific empreendimento"""
    # Create one
    create_response = client.post(
        "/v1/empreendimentos",
        json={"nome": "Empreendimento Teste"},
    )
    emp_id = create_response.json()["id"]

    # Get it
    response = client.get(f"/v1/empreendimentos/{emp_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == emp_id
    assert data["nome"] == "Empreendimento Teste"


def test_obter_empreendimento_nao_existente():
    """Test getting a non-existent empreendimento"""
    fake_id = str(uuid4())
    response = client.get(f"/v1/empreendimentos/{fake_id}")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data


def test_atualizar_empreendimento():
    """Test updating an empreendimento"""
    # Create one
    create_response = client.post(
        "/v1/empreendimentos",
        json={
            "nome": "Nome Original",
            "descricao": "Descrição Original",
        },
    )
    emp_id = create_response.json()["id"]

    # Update it
    response = client.put(
        f"/v1/empreendimentos/{emp_id}",
        json={
            "nome": "Nome Atualizado",
            "descricao": "Descrição Atualizada",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == emp_id
    assert data["nome"] == "Nome Atualizado"
    assert data["descricao"] == "Descrição Atualizada"


def test_atualizar_empreendimento_parcial():
    """Test partial update of empreendimento"""
    # Create one
    create_response = client.post(
        "/v1/empreendimentos",
        json={
            "nome": "Nome Original",
            "descricao": "Descrição Original",
        },
    )
    emp_id = create_response.json()["id"]

    # Update only name
    response = client.put(
        f"/v1/empreendimentos/{emp_id}",
        json={"nome": "Novo Nome"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "Novo Nome"
    assert data["descricao"] == "Descrição Original"  # Not changed


def test_atualizar_empreendimento_nao_existente():
    """Test updating a non-existent empreendimento"""
    fake_id = str(uuid4())
    response = client.put(
        f"/v1/empreendimentos/{fake_id}",
        json={"nome": "Novo Nome"},
    )
    assert response.status_code == 404


def test_deletar_empreendimento():
    """Test deleting an empreendimento (soft delete)"""
    # Create one
    create_response = client.post(
        "/v1/empreendimentos",
        json={"nome": "Empreendimento a Deletar"},
    )
    emp_id = create_response.json()["id"]

    # Delete it
    response = client.delete(f"/v1/empreendimentos/{emp_id}")
    assert response.status_code == 204

    # Verify it's gone (soft delete)
    response = client.get(f"/v1/empreendimentos/{emp_id}")
    assert response.status_code == 404


def test_deletar_empreendimento_nao_existente():
    """Test deleting a non-existent empreendimento"""
    fake_id = str(uuid4())
    response = client.delete(f"/v1/empreendimentos/{fake_id}")
    assert response.status_code == 404


def test_empreendimento_ativo_padrao():
    """Test that new empreendimento is active by default"""
    response = client.post(
        "/v1/empreendimentos",
        json={"nome": "Empreendimento Novo"},
    )
    data = response.json()
    assert data["ativo"] is True


def test_listar_nao_mostra_deletados():
    """Test that listing doesn't show soft-deleted items"""
    # Create 2
    for i in range(2):
        client.post(
            "/v1/empreendimentos",
            json={"nome": f"Empreendimento {i+1}"},
        )

    # Get all and delete one
    response = client.get("/v1/empreendimentos")
    emp_id = response.json()[0]["id"]
    client.delete(f"/v1/empreendimentos/{emp_id}")

    # List again
    response = client.get("/v1/empreendimentos")
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] != emp_id


def test_timestamps():
    """Test that timestamps are properly set"""
    response = client.post(
        "/v1/empreendimentos",
        json={"nome": "Empreendimento com Timestamps"},
    )
    data = response.json()
    assert "created_at" in data
    assert "updated_at" in data
    assert data["created_at"] == data["updated_at"]
