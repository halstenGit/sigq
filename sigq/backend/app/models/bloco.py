from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base


class BlocoTorre(Base):
    __tablename__ = "blocos_torres"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    empreendimento_id = Column(UUID(as_uuid=True), ForeignKey("empreendimentos.id"), nullable=False)
    nome = Column(String(100), nullable=False)
    descricao = Column(String(500))
    ativo = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    empreendimento = relationship("Empreendimento")
