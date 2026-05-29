from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import models
from app.schemas import schemas

# --- PROFISSIONAIS ---
def get_profissionais(db: Session):
    return db.query(models.Profissional).all()

def create_profissional(db: Session, profissional: schemas.ProfissionalCreate):
    db_profissional = db.query(models.Profissional).filter(
        models.Profissional.registro_conselho == profissional.registro_conselho
    ).first()
    
    if db_profissional:
        raise HTTPException(status_code=400, detail="Profissional com este registro já cadastrado.")
    
    novo_profissional = models.Profissional(**profissional.model_dump())
    db.add(novo_profissional)
    db.commit()
    db.refresh(novo_profissional)
    return novo_profissional

# --- INSUMOS ---
def get_insumos(db: Session):
    return db.query(models.Insumo).all()

def create_insumo(db: Session, insumo: schemas.InsumoCreate):
    novo_insumo = models.Insumo(**insumo.model_dump())
    db.add(novo_insumo)
    db.commit()
    db.refresh(novo_insumo)
    return novo_insumo

# --- MOVIMENTAÇÕES ---
def create_movimentacao(db: Session, movimentacao: schemas.MovimentacaoCreate):
    # Verifica se o insumo existe
    insumo = db.query(models.Insumo).filter(models.Insumo.id == movimentacao.insumo_id).first()
    if not insumo:
        raise HTTPException(status_code=404, detail="Insumo não encontrado.")
    
    # Verifica se o profissional existe
    profissional = db.query(models.Profissional).filter(models.Profissional.id == movimentacao.profissional_id).first()
    if not profissional:
        raise HTTPException(status_code=404, detail="Profissional não encontrado.")

    # Regra de negócio: Atualiza o estoque atual
    if movimentacao.tipo == models.TipoMovimentacao.ENTRADA:
        insumo.quantidade_atual += movimentacao.quantidade
    elif movimentacao.tipo == models.TipoMovimentacao.SAIDA:
        if insumo.quantidade_atual < movimentacao.quantidade:
            raise HTTPException(
                status_code=400, 
                detail=f"Estoque insuficiente. Quantidade atual: {insumo.quantidade_atual}"
            )
        insumo.quantidade_atual -= movimentacao.quantidade

    # Registra a movimentação
    nova_movimentacao = models.Movimentacao(**movimentacao.model_dump())
    db.add(nova_movimentacao)
    db.commit()
    db.refresh(nova_movimentacao)
    
    return nova_movimentacao