from pydantic import BaseModel, Field, ConfigDict
from datetime import date
from decimal import Decimal

class InventoryDailyBase(BaseModel):
    date: date
    product_id: int
    opening_stock: int = Field(..., ge=0)
    qty_sold: int = Field(..., ge=0)
    qty_waste: int = Field(..., ge=0)
    qty_restock: int = Field(..., ge=0)
    closing_stock: int = Field(..., ge=0)
    unit_cost: Decimal = Field(..., ge=0, decimal_places=2)
    stock_days: Decimal = Field(..., ge=0, decimal_places=2)

class InventoryDailyCreate(InventoryDailyBase):
    pass

class InventoryDaily(InventoryDailyBase):
    client_id: int
    waste_cost: Decimal
    inventory_value: Decimal
    model_config = ConfigDict(from_attributes=True)

class LowStockAlert(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    reorder_point: int  # Lo calcularemos después
