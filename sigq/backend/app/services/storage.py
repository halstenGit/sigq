import boto3
import os
from typing import Optional
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger("app")

class R2Storage:
    def __init__(self):
        self.account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
        self.access_key = os.getenv("CLOUDFLARE_R2_ACCESS_KEY")
        self.secret_key = os.getenv("CLOUDFLARE_R2_SECRET_KEY")
        self.bucket_name = os.getenv("CLOUDFLARE_BUCKET_NAME", "sigq-images")
        self.endpoint_url = os.getenv(
            "CLOUDFLARE_ENDPOINT_URL",
            f"https://{self.account_id}.r2.cloudflarestorage.com"
        )

        if not all([self.access_key, self.secret_key]):
            logger.warning("R2 credentials não configuradas")
            self.client = None
            return

        self.client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            region_name="auto"
        )

    def upload_file_bytes(self, file_bytes: bytes, object_name: str) -> str:
        """Upload seguro via backend para R2 com credenciais protegidas"""
        if not self.client:
            raise Exception("R2 storage não configurado")

        try:
            content_type = self._get_content_type(object_name)

            self.client.put_object(
                Bucket=self.bucket_name,
                Key=object_name,
                Body=file_bytes,
                ContentType=content_type
            )

            public_url = f"{self.endpoint_url}/{self.bucket_name}/{object_name}"
            logger.info(f"✓ Arquivo uploadado para R2: {object_name}")
            return public_url

        except ClientError as e:
            logger.error(f"Erro S3/R2: {e}")
            raise Exception(f"Erro ao fazer upload: {str(e)}")
        except Exception as e:
            logger.error(f"Erro ao fazer upload: {str(e)}")
            raise Exception(f"Erro ao fazer upload: {str(e)}")

    def delete_file(self, object_name: str) -> bool:
        """Deleta arquivo do R2"""
        if not self.client:
            raise Exception("R2 storage não configurado")

        try:
            self.client.delete_object(Bucket=self.bucket_name, Key=object_name)
            logger.info(f"✓ Arquivo deletado do R2: {object_name}")
            return True
        except Exception as e:
            logger.error(f"Erro ao deletar arquivo: {str(e)}")
            raise Exception(f"Erro ao deletar arquivo: {str(e)}")

    @staticmethod
    def _get_content_type(filename: str) -> str:
        """Detecta MIME type baseado na extensão"""
        extensions = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".pdf": "application/pdf",
            ".txt": "text/plain",
            ".mp4": "video/mp4",
        }
        ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
        return extensions.get(ext, "application/octet-stream")


# Singleton instance
_storage_instance: Optional[R2Storage] = None

def get_storage() -> R2Storage:
    """Get ou cria instância do storage"""
    global _storage_instance
    if _storage_instance is None:
        _storage_instance = R2Storage()
    return _storage_instance
