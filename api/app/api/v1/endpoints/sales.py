from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.core.dependencies import get_db, get_current_client_id
from app.schemas.sales import Sale, SaleCreate
from app.crud import sales as crud

router = APIRouter()

@router.post("/", response_model=Sale, status_code=status.HTTP_201_CREATED)
def create_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Registrar una nueva venta.
    """
    # Aquí podrías agregar validaciones (ej. que el producto exista)
    return crud.create_sale(db, client_id, sale)

@router.get("/by-date/{sale_date}", response_model=List[Sale])
def get_sales_by_date(
    sale_date: date,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Obtener ventas de una fecha específica.
    """
    return crud.get_sales_by_date(db, client_id, sale_date, skip, limit)

@router.get("/by-product/{product_id}", response_model=List[Sale])
def get_sales_by_product(
    product_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Obtener ventas de un producto específico.
    """
    return crud.get_sales_by_product(db, client_id, product_id, skip, limit)
