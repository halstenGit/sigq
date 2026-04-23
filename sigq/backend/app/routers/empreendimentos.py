from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.schemas.empreendimento import (
    EmpreendimentoCreate,
    EmpreendimentoUpdate,
    EmpreendimentoResponse,
)
from app.services.empreendimento import EmpreendimentoService

router = APIRouter(prefix="/v1/empreendimentos", tags=["empreendimentos"])


@router.post("", response_model=EmpreendimentoResponse, status_code=201)
async def criar_empreendimento(
    obj_in: EmpreendimentoCreate,
    db: Session = Depends(get_db),
):
    empreendimento = EmpreendimentoService.criar(db, obj_in)
    return empreendimento


@router.get("", response_model=List[EmpreendimentoResponse])
async def listar_empreendimentos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    empreendimentos = EmpreendimentoService.listar(db, skip, limit)
    return empreendimentos


@router.get("/{empreendimento_id}", response_model=EmpreendimentoResponse)
async def obter_empreendimento(
    empreendimento_id: UUID,
    db: Session = Depends(get_db),
):
    empreendimento = EmpreendimentoService.obter_por_id(db, empreendimento_id)
    if not empreendimento:
        raise HTTPException(status_code=404, detail="Empreendimento não encontrado")
    return empreendimento


@router.put("/{empreendimento_id}", response_model=EmpreendimentoResponse)
async def atualizar_empreendimento(
    empreendimento_id: UUID,
    obj_in: EmpreendimentoUpdate,
    db: Session = Depends(get_db),
):
    empreendimento = EmpreendimentoService.obter_por_id(db, empreendimento_id)
    if not empreendimento:
        raise HTTPException(status_code=404, detail="Empreendimento não encontrado")
    empreendimento = EmpreendimentoService.atualizar(db, empreendimento, obj_in)
    return empreendimento


@router.delete("/{empreendimento_id}", status_code=204)
async def deletar_empreendimento(
    empreendimento_id: UUID,
    db: Session = Depends(get_db),
):
    empreendimento = EmpreendimentoService.obter_por_id(db, empreendimento_id)
    if not empreendimento:
        raise HTTPException(status_code=404, detail="Empreendimento não encontrado")
    EmpreendimentoService.deletar(db, empreendimento)
