import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.migrations import run_migrations
from app.core.exceptions import InternalServerError
from app.routers import auth, empreendimentos, evidencias

logger = setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting SIGQ API...")
    try:
        run_migrations()
        logger.info("✓ Application startup complete")
    except Exception as e:
        logger.error(f"✗ Startup failed: {e}", exc_info=True)
        raise

    yield

    # Shutdown
    logger.info("Shutting down SIGQ API...")


app = FastAPI(
    title="SIGQ API",
    description="Sistema de Gestão da Qualidade - Halsten Incorporadora",
    version="0.1.0",
    lifespan=lifespan,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Erro interno do servidor"},
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Erro ao acessar banco de dados"},
    )


app.include_router(auth.router)
app.include_router(empreendimentos.router)
app.include_router(evidencias.router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "sigq-api", "debug": settings.DEBUG}


@app.get("/v1")
async def api_root():
    return {"message": "SIGQ API v1", "version": "0.1.0"}
