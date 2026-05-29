from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Utilizaremos um arquivo local SQLite na raiz da pasta backend para facilitar a avaliação.
SQLALCHEMY_DATABASE_URL = "sqlite:///./fesf_estoque.db"

# connect_args={"check_same_thread": False} é necessário apenas para o SQLite no FastAPI,
# pois ele permite que mais de uma thread interaja com a mesma conexão de banco de dados.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal será a fábrica de sessões reais do banco de dados para cada requisição.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base é a classe a partir da qual herdaremos para criar os modelos ORM (tabelas).
Base = declarative_base()

def get_db():
    """
    Função geradora para prover a sessão do banco de dados nas rotas do FastAPI.
    Garante que a sessão seja fechada automaticamente após o fim da requisição.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()