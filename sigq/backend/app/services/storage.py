import boto3
import os
from typing import Optional
from datetime import timedelta

class R2Storage:
    def __init__(self):
        self.account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
        self.access_key = os.getenv("CLOUDFLARE_ACCESS_KEY")
        self.secret_key = os.getenv("CLOUDFLARE_SECRET_KEY")
        self.bucket_name = os.getenv("CLOUDFLARE_BUCKET_NAME", "sigq-images")
        self.endpoint_url = f"https://{self.account_id}.r2.cloudflarestorage.com"

        self.client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            region_name="auto"
        )

    def upload_file(self, file_path: str, object_name: Optional[str] = None) -> str:
        """Upload arquivo para R2 e retorna URL pública"""
        if object_name is None:
            object_name = file_path.split("/")[-1]

        try:
            self.client.upload_file(
                file_path,
                self.bucket_name,
                object_name,
                ExtraArgs={'ContentType': self._get_content_type(object_name)}
            )

            public_url = f"{self.endpoint_url}/{self.bucket_name}/{object_name}"
            return public_url
        except Exception as e:
            raise Exception(f"Erro ao fazer upload: {str(e)}")

    def upload_file_bytes(self, file_bytes: bytes, object_name: str) -> str:
        """Upload de arquivo em bytes para R2"""
        try:
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=object_name,
                Body=file_bytes,
                ContentType=self._get_content_type(object_name)
            )

            public_url = f"{self.endpoint_url}/{self.bucket_name}/{object_name}"
            return public_url
        except Exception as e:
            raise Exception(f"Erro ao fazer upload: {str(e)}")

    def get_presigned_download_url(self, object_name: str, expiration: int = 3600) -> str:
        """Gera URL presigned para download"""
        try:
            url = self.client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            return url
        except Exception as e:
            raise Exception(f"Erro ao gerar URL presigned: {str(e)}")

    def delete_file(self, object_name: str) -> bool:
        """Deleta arquivo do R2"""
        try:
            self.client.delete_object(Bucket=self.bucket_name, Key=object_name)
            return True
        except Exception as e:
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
