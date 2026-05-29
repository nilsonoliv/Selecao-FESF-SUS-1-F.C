from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import datetime
from app.models.models import TipoMovimentacao

# ==========================================
# SCHEMAS PARA PROFISSIONAL
# ==========================================
class ProfissionalBase(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    registro_conselho: str = Field(..., min_length=4, max_length=50)
    cargo: str = Field(..., min_length=2, max_length=50)

class ProfissionalCreate(ProfissionalBase):
    pass

class ProfissionalResponse(ProfissionalBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# ==========================================
# SCHEMAS PARA INSUMO
# ==========================================
class InsumoBase(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    descricao: Optional[str] = Field(None, max_length=255)
    estoque_minimo: int = Field(..., ge=0)

class InsumoCreate(InsumoBase):
    pass

class InsumoResponse(InsumoBase):
    id: int
    quantidade_atual: int
    
    model_config = ConfigDict(from_attributes=True)

# ==========================================
# SCHEMAS PARA MOVIMENTACAO
# ==========================================
class MovimentacaoBase(BaseModel):
    tipo: TipoMovimentacao
    quantidade: int = Field(..., gt=0, description="A quantidade deve ser maior que zero")
    insumo_id: int
    profissional_id: int

class MovimentacaoCreate(MovimentacaoBase):
    pass

class MovimentacaoResponse(MovimentacaoBase):
    id: int
    data_hora: datetime
    
    model_config = ConfigDict(from_attributes=True)