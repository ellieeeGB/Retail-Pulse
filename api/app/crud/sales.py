from sqlalchemy.orm import Session
from app.models.domain import Sale
from app.schemas.sales import SaleCreate
from datetime import date

def create_sale(db: Session, client_id: int, sale: SaleCreate):
    db_sale = Sale(
        client_id=client_id,
        **sale.model_dump()
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

def get_sales_by_date(db: Session, client_id: int, sale_date: date, skip: int = 0, limit: int = 100):
    return db.query(Sale).filter(
        Sale.client_id == client_id,
        Sale.date == sale_date
    ).offset(skip).limit(limit).all()

def get_sales_by_product(db: Session, client_id: int, product_id: int, skip: int = 0, limit: int = 100):
    return db.query(Sale).filter(
        Sale.client_id == client_id,
        Sale.product_id == product_id
    ).offset(skip).limit(limit).all()
