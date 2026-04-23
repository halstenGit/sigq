from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class EmpreendimentoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    localizacao: Optional[str] = None
    id_sienge: Optional[str] = None


class EmpreendimentoCreate(EmpreendimentoBase):
    pass


class EmpreendimentoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    localizacao: Optional[str] = None
    ativo: Optional[bool] = None


class EmpreendimentoResponse(EmpreendimentoBase):
    id: UUID
    ativo: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
