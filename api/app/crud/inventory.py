from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models.domain import InventoryDaily

def get_inventory_by_date(db: Session, client_id: int, inv_date):
    return (
        db.query(InventoryDaily)
        .filter(
            InventoryDaily.client_id == client_id,
            InventoryDaily.date == inv_date
        )
        .all()
    )

def get_inventory_by_product(db: Session, client_id: int, product_id: int, limit: int = 30):
    return (
        db.query(InventoryDaily)
        .filter(
            InventoryDaily.client_id == client_id,
            InventoryDaily.product_id == product_id
        )
        .order_by(InventoryDaily.date.desc())
        .limit(limit)
        .all()
    )

def get_latest_inventory(db: Session, client_id: int):
    latest_date_subquery = (
        db.query(
            InventoryDaily.client_id,
            func.max(InventoryDaily.date).label("max_date")
        )
        .filter(InventoryDaily.client_id == client_id)
        .group_by(InventoryDaily.client_id)
        .subquery()
    )

    return (
        db.query(InventoryDaily)
        .join(
            latest_date_subquery,
            and_(
                InventoryDaily.client_id == latest_date_subquery.c.client_id,
                InventoryDaily.date == latest_date_subquery.c.max_date,
            )
        )
        .filter(InventoryDaily.client_id == client_id)
        .all()
    )

def get_latest_inventory_for_product(db: Session, client_id: int, product_id: int):
    return (
        db.query(InventoryDaily)
        .filter(
            InventoryDaily.client_id == client_id,
            InventoryDaily.product_id == product_id
        )
        .order_by(InventoryDaily.date.desc())
        .first()
    )
