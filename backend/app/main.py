from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from app.database import engine, Base

# Cria as tabelas no banco de dados SQLite (se não existirem)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FESF-SUS API - Controle de Estoque",
    description="API RESTful para controle de estoque e insumos da FESF-SUS.",
    version="1.0.0"
)

# Configuração de CORS para permitir requisições do Front-end (React/Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, substitua "*" pelo domínio do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão das rotas da API
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "mensagem": "API FESF-SUS está rodando com sucesso!",
        "documentacao": "/docs"
    }