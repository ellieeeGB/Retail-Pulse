from sqlalchemy.orm import Session
from app.models.domain import KPIDaily as KPIDailyModel, TopProduct as TopProductModel
from datetime import date


def get_kpi_daily(db: Session, client_id: int, kpi_date: date):
    return (
        db.query(KPIDailyModel)
        .filter(
            KPIDailyModel.client_id == client_id,
            KPIDailyModel.date == kpi_date
        )
        .first()
    )


def get_kpi_range(db: Session, client_id: int, start_date: date, end_date: date):
    return (
        db.query(KPIDailyModel)
        .filter(
            KPIDailyModel.client_id == client_id,
            KPIDailyModel.date >= start_date,
            KPIDailyModel.date <= end_date
        )
        .order_by(KPIDailyModel.date)
        .all()
    )


def get_top_products(db: Session, client_id: int, limit: int = 10):
    return (
        db.query(TopProductModel)
        .filter(TopProductModel.client_id == client_id)
        .order_by(TopProductModel.units_sold.desc())
        .limit(limit)
        .all()
    )
