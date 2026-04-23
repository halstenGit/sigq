import logging
from alembic import command
from alembic.config import Config

logger = logging.getLogger("app")


def run_migrations():
    """Execute pending migrations on application startup"""
    try:
        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("sqlalchemy.url", "env_var")

        # Load from environment or use default
        from app.core.config import settings
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

        command.upgrade(alembic_cfg, "head")
        logger.info("✓ Database migrations completed successfully")
    except Exception as e:
        logger.error(f"✗ Database migration failed: {e}", exc_info=True)
        raise
