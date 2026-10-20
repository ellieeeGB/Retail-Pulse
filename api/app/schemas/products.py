from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime

class ProductBase(BaseModel):
    product_id: int
    product_name: str
    category: str
    supplier: str
    cost_mxn: Decimal = Field(..., ge=0, decimal_places=2)
    price_mxn: Decimal = Field(..., ge=0, decimal_places=2)
    price_delivery: Decimal | None = Field(None, ge=0, decimal_places=2)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_name: str | None = None
    category: str | None = None
    supplier: str | None = None
    cost_mxn: Decimal | None = Field(None, ge=0, decimal_places=2)
    price_mxn: Decimal | None = Field(None, ge=0, decimal_places=2)
    price_delivery: Decimal | None = Field(None, ge=0, decimal_places=2)

class Product(ProductBase):
    client_id: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True
