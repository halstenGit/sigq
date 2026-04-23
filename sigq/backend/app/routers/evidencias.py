import logging
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import InternalServerError
from app.core.storage import get_storage
from app.models.evidencia import Evidencia
from app.schemas.evidencia import EvidenciaResponse
import json

logger = logging.getLogger("app")
router = APIRouter(prefix="/v1/evidencias", tags=["evidencias"])


@router.post("/upload", response_model=EvidenciaResponse, status_code=201)
async def upload_evidencia(
    file: UploadFile = File(...),
    metadata: str = None,  # JSON string com EXIF, coordenadas, etc
    db: Session = Depends(get_db),
):
    """Upload foto para Cloudflare R2"""
    try:
        storage = get_storage()
        if not storage:
            raise InternalServerError("Storage não configurado")

        logger.info(f"Uploadando arquivo: {file.filename}")

        # Ler arquivo
        content = await file.read()
        tamanho_bytes = len(content)

        # Validar tamanho (max 10MB)
        if tamanho_bytes > 10 * 1024 * 1024:
            raise ValueError("Arquivo muito grande (máximo 10MB)")

        # Upload para R2
        url_r2 = storage.upload_photo(
            content,
            file.filename,
            file.content_type or "image/jpeg",
        )

        # Salvar registro no banco
        metadata_dict = None
        if metadata:
            try:
                metadata_dict = json.loads(metadata)
            except json.JSONDecodeError:
                logger.warning(f"Metadata inválida: {metadata}")

        evidencia = Evidencia(
            tipo="foto",
            nome_arquivo=file.filename,
            url_r2=url_r2,
            tamanho_bytes=str(tamanho_bytes),
            mime_type=file.content_type or "image/jpeg",
            metadata=metadata_dict,
        )

        db.add(evidencia)
        db.commit()
        db.refresh(evidencia)

        logger.info(f"✓ Evidência salva: {evidencia.id}")
        return evidencia

    except ValueError as e:
        logger.warning(f"Validação: {e}")
        raise InternalServerError(str(e))
    except Exception as e:
        logger.error(f"Erro ao upload: {e}", exc_info=True)
        raise InternalServerError("Erro ao fazer upload de arquivo")


@router.get("/{evidencia_id}", response_model=EvidenciaResponse)
async def obter_evidencia(
    evidencia_id: str,
    db: Session = Depends(get_db),
):
    """Obter URL da evidência"""
    try:
        evidencia = db.query(Evidencia).filter(
            Evidencia.id == evidencia_id,
            Evidencia.ativo == True,
        ).first()

        if not evidencia:
            raise InternalServerError("Evidência não encontrada")

        return evidencia

    except Exception as e:
        logger.error(f"Erro ao obter evidência: {e}", exc_info=True)
        raise InternalServerError("Erro ao obter evidência")
