import logging
import logging.config
from pathlib import Path
from app.core.config import settings

# Criar diretório de logs se não existir
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "detailed": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "level": "DEBUG" if settings.DEBUG else "INFO",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "logs/sigq.log",
            "maxBytes": 10485760,
            "backupCount": 5,
            "formatter": "detailed",
            "level": "DEBUG" if settings.DEBUG else "INFO",
        },
        "error_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "logs/sigq_errors.log",
            "maxBytes": 10485760,
            "backupCount": 5,
            "formatter": "detailed",
            "level": "ERROR",
        },
    },
    "loggers": {
        "app": {
            "handlers": ["console", "file", "error_file"],
            "level": "DEBUG" if settings.DEBUG else "INFO",
            "propagate": False,
        },
        "sqlalchemy.engine": {
            "handlers": ["console", "file"],
            "level": "DEBUG" if settings.DEBUG else "INFO",
            "propagate": False,
        },
        "uvicorn.access": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": False,
        },
    },
    "root": {
        "level": "DEBUG" if settings.DEBUG else "INFO",
        "handlers": ["console", "file"],
    },
}


def setup_logging():
    """Setup logging configuration"""
    logging.config.dictConfig(LOGGING_CONFIG)
    logger = logging.getLogger("app")
    logger.info(f"SIGQ started - Debug mode: {settings.DEBUG}")
    return logger


# Lazy logger instance
_logger = None


def get_logger(name: str = "app") -> logging.Logger:
    """Get logger instance"""
    global _logger
    if _logger is None:
        _logger = setup_logging()
    return logging.getLogger(name)
