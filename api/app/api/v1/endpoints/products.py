from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_db, get_current_client_id
from app.schemas.products import Product, ProductCreate, ProductUpdate
from app.crud import products as crud

router = APIRouter()

@router.get("/", response_model=List[Product])
def read_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Obtener todos los productos del cliente actual.
    """
    products = crud.get_products(db, client_id, skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=Product)
def read_product(
    product_id: int,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Obtener un producto específico por su ID.
    """
    db_product = crud.get_product(db, client_id, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Crear un nuevo producto.
    """
    # Verificar si ya existe un producto con el mismo ID para este cliente
    existing = crud.get_product(db, client_id, product.product_id)
    if existing:
        raise HTTPException(status_code=400, detail="Product ID already exists for this client")
    return crud.create_product(db, client_id, product)

@router.put("/{product_id}", response_model=Product)
@router.patch("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Actualizar un producto existente.
    """
    db_product = crud.update_product(db, client_id, product_id, product_update)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Eliminar un producto.
    """
    deleted = crud.delete_product(db, client_id, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return None
