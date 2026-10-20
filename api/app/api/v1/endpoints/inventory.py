from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.core.dependencies import get_db, get_current_client_id
from app.schemas.inventory import InventoryDaily, LowStockAlert
from app.crud import inventory as crud
from app.crud import products as product_crud

router = APIRouter()

@router.get("/by-date/{inv_date}", response_model=List[InventoryDaily])
def get_inventory_by_date(
    inv_date: date,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Obtener el inventario de todos los productos para una fecha específica.
    """
    return crud.get_inventory_by_date(db, client_id, inv_date)

@router.get("/product/{product_id}", response_model=List[InventoryDaily])
def get_inventory_by_product(
    product_id: int,
    limit: int = 30,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Obtener el historial de inventario de un producto.
    """
    return crud.get_inventory_by_product(db, client_id, product_id, limit)

@router.get("/low-stock", response_model=List[LowStockAlert])
def get_low_stock_alerts(
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    """
    Generar alertas de bajo stock basado en el punto de reorden de cada producto.
    """
    latest = crud.get_latest_inventory(db, client_id)
    alerts = []
    for inv in latest:
        product = product_crud.get_product(db, client_id, inv.product_id)
        if product and inv.closing_stock <= product.reorder_point:
            alerts.append(LowStockAlert(
                product_id=inv.product_id,
                product_name=product.product_name,
                current_stock=inv.closing_stock,
                reorder_point=product.reorder_point
            ))
    return alerts

@router.get("/reorder-point/{product_id}", response_model=int)
def get_reorder_point(
    product_id: int,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id)
):
    product = product_crud.get_product(db, client_id, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product.reorder_point
