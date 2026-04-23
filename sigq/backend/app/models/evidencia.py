from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base


class Evidencia(Base):
    __tablename__ = "evidencias"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Pode estar vinculada a RNC (futura) ou diretamente a FVS (futura)
    # Por enquanto, deixamos genérico
    tipo = Column(String(20), nullable=False)  # foto, documento
    nome_arquivo = Column(String(255), nullable=False)
    url_r2 = Column(String(500), nullable=False)
    tamanho_bytes = Column(String(20))
    mime_type = Column(String(50), default="image/jpeg")

    # Metadata EXIF
    metadata = Column(JSON, nullable=True)

    ativo = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        server_default="CURRENT_TIMESTAMP",
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        server_default="CURRENT_TIMESTAMP",
    )
