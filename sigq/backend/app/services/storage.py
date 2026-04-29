import requests
import os
from typing import Optional
from urllib.parse import urljoin
import logging

logger = logging.getLogger("app")

class R2Storage:
    def __init__(self):
        self.account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
        self.api_token = os.getenv("CLOUDFLARE_API_TOKEN")
        self.bucket_name = os.getenv("CLOUDFLARE_BUCKET_NAME", "sigq-images")
        self.endpoint_url = os.getenv(
            "CLOUDFLARE_ENDPOINT_URL",
            f"https://{self.account_id}.r2.cloudflarestorage.com"
        )
        self.api_base = "https://api.cloudflare.com/client/v4"
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

    def upload_file_bytes(self, file_bytes: bytes, object_name: str) -> str:
        """Upload de arquivo em bytes para R2 via API"""
        try:
            # Upload direto via HTTP PUT no endpoint R2
            upload_url = f"{self.endpoint_url}/{self.bucket_name}/{object_name}"

            headers = {
                "Content-Type": self._get_content_type(object_name)
            }

            response = requests.put(
                upload_url,
                data=file_bytes,
                headers=headers,
                timeout=30
            )

            if response.status_code not in [200, 201]:
                logger.error(f"R2 upload failed: {response.status_code} - {response.text}")
                raise Exception(f"Upload falhou: {response.status_code}")

            logger.info(f"✓ Arquivo uploadado para R2: {object_name}")
            return upload_url

        except Exception as e:
            logger.error(f"Erro ao fazer upload: {str(e)}")
            raise Exception(f"Erro ao fazer upload: {str(e)}")

    def delete_file(self, object_name: str) -> bool:
        """Deleta arquivo do R2"""
        try:
            delete_url = f"{self.endpoint_url}/{self.bucket_name}/{object_name}"

            response = requests.delete(delete_url, timeout=30)

            if response.status_code not in [200, 204]:
                raise Exception(f"Delete falhou: {response.status_code}")

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
