from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings
from app.models.domain import Base

settings = get_settings()

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # verifica que la conexión esté viva antes de usarla
    pool_size=20,        # número de conexiones en el pool
    max_overflow=10      # conexiones extra si el pool está lleno
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
