from sqlalchemy.orm import Session
from app.models.domain import Product
from app.schemas.products import ProductCreate, ProductUpdate

def get_product(db: Session, client_id: int, product_id: int):
    return db.query(Product).filter(
        Product.client_id == client_id,
        Product.product_id == product_id
    ).first()

def get_products(db: Session, client_id: int, skip: int = 0, limit: int = 100):
    return db.query(Product).filter(Product.client_id == client_id).offset(skip).limit(limit).all()

def create_product(db: Session, client_id: int, product: ProductCreate):
    db_product = Product(
        client_id=client_id,
        **product.model_dump()
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, client_id: int, product_id: int, product_update: ProductUpdate):
    db_product = get_product(db, client_id, product_id)
    if not db_product:
        return None
    update_data = product_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, client_id: int, product_id: int):
    db_product = get_product(db, client_id, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False
