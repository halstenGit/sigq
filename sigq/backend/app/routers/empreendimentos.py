import logging
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.exceptions import NotFoundException, InternalServerError
from app.schemas.empreendimento import (
    EmpreendimentoCreate,
    EmpreendimentoUpdate,
    EmpreendimentoResponse,
)
from app.services.empreendimento import EmpreendimentoService

logger = logging.getLogger("app")
router = APIRouter(prefix="/v1/empreendimentos", tags=["empreendimentos"])


@router.post("", response_model=EmpreendimentoResponse, status_code=201)
async def criar_empreendimento(
    obj_in: EmpreendimentoCreate,
    db: Session = Depends(get_db),
):
    try:
        logger.info(f"Criando empreendimento: {obj_in.nome}")
        empreendimento = EmpreendimentoService.criar(db, obj_in)
        logger.info(f"✓ Empreendimento criado: {empreendimento.id}")
        return empreendimento
    except SQLAlchemyError as e:
        logger.error(f"Database error creating empreendimento: {e}", exc_info=True)
        raise InternalServerError("Erro ao criar empreendimento no banco de dados")
    except Exception as e:
        logger.error(f"Unexpected error creating empreendimento: {e}", exc_info=True)
        raise InternalServerError("Erro ao criar empreendimento")


@router.get("", response_model=List[EmpreendimentoResponse])
async def listar_empreendimentos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    try:
        logger.debug(f"Listando empreendimentos: skip={skip}, limit={limit}")
        empreendimentos = EmpreendimentoService.listar(db, skip, limit)
        logger.debug(f"✓ {len(empreendimentos)} empreendimentos encontrados")
        return empreendimentos
    except SQLAlchemyError as e:
        logger.error(f"Database error listing empreendimentos: {e}", exc_info=True)
        raise InternalServerError("Erro ao listar empreendimentos")
    except Exception as e:
        logger.error(f"Unexpected error listing empreendimentos: {e}", exc_info=True)
        raise InternalServerError("Erro ao listar empreendimentos")


@router.get("/{empreendimento_id}", response_model=EmpreendimentoResponse)
async def obter_empreendimento(
    empreendimento_id: UUID,
    db: Session = Depends(get_db),
):
    try:
        logger.debug(f"Obtendo empreendimento: {empreendimento_id}")
        empreendimento = EmpreendimentoService.obter_por_id(db, empreendimento_id)
        if not empreendimento:
            logger.warning(f"Empreendimento não encontrado: {empreendimento_id}")
            raise NotFoundException("Empreendimento não encontrado")
        logger.debug(f"✓ Empreendimento encontrado: {empreendimento.nome}")
        return empreendimento
    except NotFoundException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error getting empreendimento: {e}", exc_info=True)
        raise InternalServerError("Erro ao obter empreendimento")
    except Exception as e:
        logger.error(f"Unexpected error getting empreendimento: {e}", exc_info=True)
        raise InternalServerError("Erro ao obter empreendimento")


@router.put("/{empreendimento_id}", response_model=EmpreendimentoResponse)
async def atualizar_empreendimento(
    empreendimento_id: UUID,
    obj_in: EmpreendimentoUpdate,
    db: Session = Depends(get_db),
):
    try:
        logger.info(f"Atualizando empreendimento: {empreendimento_id}")
        empreendimento = EmpreendimentoService.obter_por_id(db, empreendimento_id)
        if not empreendimento:
            logger.warning(f"Empreendimento não encontrado para atualização: {empreendimento_id}")
            raise NotFoundException("Empreendimento não encontrado")
        empreendimento = EmpreendimentoService.atualizar(db, empreendimento, obj_in)
        logger.info(f"✓ Empreendimento atualizado: {empreendimento_id}")
        return empreendimento
    except NotFoundException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error updating empreendimento: {e}", exc_info=True)
        raise InternalServerError("Erro ao atualizar empreendimento")
    except Exception as e:
        logger.error(f"Unexpected error updating empreendimento: {e}", exc_info=True)
        raise InternalServerError("Erro ao atualizar empreendimento")


@router.delete("/{empreendimento_id}", status_code=204)
async def deletar_empreendimento(
    empreendimento_id: UUID,
    db: Session = Depends(get_db),
):
    try:
        logger.info(f"Deletando empreendimento: {empreendimento_id}")
        empreendimento = EmpreendimentoService.obter_por_id(db, empreendimento_id)
        if not empreendimento:
            logger.warning(f"Empreendimento não encontrado para deleção: {empreendimento_id}")
            raise NotFoundException("Empreendimento não encontrado")
        EmpreendimentoService.deletar(db, empreendimento)
        logger.info(f"✓ Empreendimento deletado: {empreendimento_id}")
    except NotFoundException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error deleting empreendimento: {e}", exc_info=True)
        raise InternalServerError("Erro ao deletar empreendimento")
    except Exception as e:
        logger.error(f"Unexpected error deleting empreendimento: {e}", exc_info=True)
        raise InternalServerError("Erro ao deletar empreendimento")
