from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    DEBUG: bool = True
    APP_NAME: str = "SIGQ"

    # Database (SQLite for local dev, PostgreSQL for production on Railway)
    DATABASE_URL: str = "sqlite:///./sigq.db"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*",
    ]

    # Cloudflare R2
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET_NAME: str = "sigq-evidencias"
    R2_ENDPOINT_URL: str = ""

    # Sienge API
    SIENGE_BASE_URL: str = "https://api.sienge.com.br/halsten/public/api/v1"
    SIENGE_USERNAME: str = ""
    SIENGE_PASSWORD: str = ""

    # Prevision API
    PREVISION_API_URL: str = ""
    PREVISION_TOKEN: str = ""

    # Entra ID (Microsoft)
    ENTRA_TENANT_ID: str = ""
    ENTRA_CLIENT_ID: str = ""
    ENTRA_CLIENT_SECRET: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
