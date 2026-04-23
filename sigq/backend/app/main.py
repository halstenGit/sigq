from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import empreendimentos

app = FastAPI(
    title="SIGQ API",
    description="Sistema de Gestão da Qualidade - Halsten Incorporadora",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(empreendimentos.router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "sigq-api"}


@app.get("/v1")
async def api_root():
    return {"message": "SIGQ API v1", "version": "0.1.0"}
