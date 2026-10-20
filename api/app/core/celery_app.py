from celery import Celery
from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "retailpulse",
    broker=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
    backend=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
    include=["app.tasks.reorder", "app.tasks.recommendations", "app.tasks.alerts"]
)

# Configuración opcional
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="America/Mexico_City",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutos
    task_soft_time_limit=20 * 60,  # 20 minutos
)

if __name__ == "__main__":
    celery_app.start()
