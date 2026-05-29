from fastapi.testclient import TestClient
from app.main import app

# Instancia o cliente de testes do FastAPI
client = TestClient(app)

def test_root_endpoint():
    """
    Testa se a API está no ar e respondendo no endpoint raiz.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert "mensagem" in response.json()

def test_listar_profissionais_vazio_ou_preenchido():
    """
    Testa a rota de listagem de profissionais.
    O retorno deve ser uma lista (status 200), mesmo que vazia.
    """
    response = client.get("/api/profissionais")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_listar_insumos_vazio_ou_preenchido():
    """
    Testa a rota de listagem de insumos.
    O retorno deve ser uma lista (status 200), mesmo que vazia.
    """
    response = client.get("/api/insumos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)