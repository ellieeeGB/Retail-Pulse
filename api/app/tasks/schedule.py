from celery.schedules import crontab
from app.core.celery_app import celery_app

celery_app.conf.beat_schedule = {
    "generate-purchase-orders-daily": {
        "task": "app.tasks.reorder.generate_purchase_orders",
        "schedule": crontab(hour=2, minute=0),  # Todos los días a las 2:00 AM
    },
    "send-low-stock-alerts-daily": {
        "task": "app.tasks.alerts.send_low_stock_alerts",
        "schedule": crontab(hour=7, minute=0),  # Todos los días a las 7:00 AM
    },
    "export-recommendations-weekly": {
        "task": "app.tasks.recommendations.export_recommendations",
        "schedule": crontab(day_of_week=1, hour=3, minute=0),  # Todos los lunes a las 3:00 AM
    },
}

celery_app.conf.timezone = "America/Mexico_City"

