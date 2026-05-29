from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas import schemas
from app.services import services

router = APIRouter()

# --- ROTAS DE PROFISSIONAIS ---
@router.get("/profissionais", response_model=List[schemas.ProfissionalResponse])
def listar_profissionais(db: Session = Depends(get_db)):
    return services.get_profissionais(db)

@router.post("/profissionais", response_model=schemas.ProfissionalResponse, status_code=status.HTTP_201_CREATED)
def criar_profissional(profissional: schemas.ProfissionalCreate, db: Session = Depends(get_db)):
    return services.create_profissional(db=db, profissional=profissional)

# --- ROTAS DE INSUMOS ---
@router.get("/insumos", response_model=List[schemas.InsumoResponse])
def listar_insumos(db: Session = Depends(get_db)):
    return services.get_insumos(db)

@router.post("/insumos", response_model=schemas.InsumoResponse, status_code=status.HTTP_201_CREATED)
def criar_insumo(insumo: schemas.InsumoCreate, db: Session = Depends(get_db)):
    return services.create_insumo(db=db, insumo=insumo)

# --- ROTAS DE MOVIMENTAÇÕES ---
@router.post("/movimentacoes", response_model=schemas.MovimentacaoResponse, status_code=status.HTTP_201_CREATED)
def registrar_movimentacao(movimentacao: schemas.MovimentacaoCreate, db: Session = Depends(get_db)):
    return services.create_movimentacao(db=db, movimentacao=movimentacao)