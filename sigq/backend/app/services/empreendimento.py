from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.empreendimento import Empreendimento
from app.schemas.empreendimento import EmpreendimentoCreate, EmpreendimentoUpdate
from typing import List, Optional
from uuid import UUID


class EmpreendimentoService:
    @staticmethod
    def criar(db: Session, obj_in: EmpreendimentoCreate) -> Empreendimento:
        obj_db = Empreendimento(**obj_in.model_dump())
        db.add(obj_db)
        db.commit()
        db.refresh(obj_db)
        return obj_db

    @staticmethod
    def obter_por_id(db: Session, id: UUID) -> Optional[Empreendimento]:
        return db.query(Empreendimento).filter(
            Empreendimento.id == id,
            Empreendimento.ativo == True,
        ).first()

    @staticmethod
    def listar(db: Session, skip: int = 0, limit: int = 100) -> List[Empreendimento]:
        return db.query(Empreendimento).filter(
            Empreendimento.ativo == True
        ).offset(skip).limit(limit).all()

    @staticmethod
    def atualizar(
        db: Session,
        empreendimento: Empreendimento,
        obj_in: EmpreendimentoUpdate,
    ) -> Empreendimento:
        obj_data = obj_in.model_dump(exclude_unset=True)
        for field, value in obj_data.items():
            setattr(empreendimento, field, value)
        db.add(empreendimento)
        db.commit()
        db.refresh(empreendimento)
        return empreendimento

    @staticmethod
    def deletar(db: Session, empreendimento: Empreendimento) -> None:
        empreendimento.ativo = False
        db.add(empreendimento)
        db.commit()
