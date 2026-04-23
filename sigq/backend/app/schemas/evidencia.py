from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class EvidenciaBase(BaseModel):
    tipo: str
    nome_arquivo: str
    tamanho_bytes: Optional[str] = None
    mime_type: Optional[str] = "image/jpeg"


class EvidenciaCreate(EvidenciaBase):
    pass


class EvidenciaResponse(EvidenciaBase):
    id: UUID
    url_r2: str
    metadata: Optional[dict] = None
    ativo: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
