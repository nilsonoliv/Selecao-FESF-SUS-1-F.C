from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

# Importa a classe Base do arquivo database.py que criamos na etapa anterior
# Considerando que o database.py está na pasta app/
from app.database import Base 

class TipoMovimentacao(enum.Enum):
    ENTRADA = "entrada"
    SAIDA = "saida"

class Profissional(Base):
    __tablename__ = "profissionais"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    registro_conselho = Column(String(50), unique=True, index=True, nullable=False)
    cargo = Column(String(50), nullable=False)

    # Relacionamento com as movimentações feitas por este profissional
    movimentacoes = relationship("Movimentacao", back_populates="profissional")

class Insumo(Base):
    __tablename__ = "insumos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), index=True, nullable=False)
    descricao = Column(String(255), nullable=True)
    estoque_minimo = Column(Integer, nullable=False, default=10)
    quantidade_atual = Column(Integer, nullable=False, default=0)

    # Relacionamento com as movimentações deste insumo
    movimentacoes = relationship("Movimentacao", back_populates="insumo")

class Movimentacao(Base):
    __tablename__ = "movimentacoes"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(Enum(TipoMovimentacao), nullable=False)
    quantidade = Column(Integer, nullable=False)
    data_hora = Column(DateTime(timezone=True), server_default=func.now())
    
    insumo_id = Column(Integer, ForeignKey("insumos.id"), nullable=False)
    profissional_id = Column(Integer, ForeignKey("profissionais.id"), nullable=False)

    # Relacionamentos
    insumo = relationship("Insumo", back_populates="movimentacoes")
    profissional = relationship("Profissional", back_populates="movimentacoes")