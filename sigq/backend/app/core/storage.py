import boto3
import logging
from io import BytesIO
from app.core.config import settings

logger = logging.getLogger("app")


class R2Storage:
    """Cloudflare R2 Storage (S3-compatible)"""

    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
            region_name="auto",
        )
        self.bucket = settings.R2_BUCKET_NAME

    def upload_photo(
        self,
        file_data: bytes,
        file_name: str,
        content_type: str = "image/jpeg",
    ) -> str:
        """Upload file to R2 and return public URL"""
        try:
            key = f"evidencias/{file_name}"

            self.client.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=file_data,
                ContentType=content_type,
            )

            # Construir URL pública
            public_url = (
                f"https://pub-{settings.R2_ACCOUNT_ID}.r2.dev/{key}"
            )

            logger.info(f"✓ Arquivo salvo em R2: {key}")
            return public_url

        except Exception as e:
            logger.error(f"✗ Erro ao fazer upload em R2: {e}", exc_info=True)
            raise

    def delete_photo(self, file_name: str) -> bool:
        """Delete file from R2"""
        try:
            key = f"evidencias/{file_name}"
            self.client.delete_object(Bucket=self.bucket, Key=key)
            logger.info(f"✓ Arquivo deletado do R2: {key}")
            return True
        except Exception as e:
            logger.error(f"✗ Erro ao deletar de R2: {e}", exc_info=True)
            return False


def get_storage() -> R2Storage:
    """Get R2 storage instance"""
    if not settings.R2_ACCESS_KEY_ID:
        logger.warning("R2 credentials not configured, storage disabled")
        return None
    return R2Storage()
