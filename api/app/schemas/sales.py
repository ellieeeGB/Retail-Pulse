from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date
from decimal import Decimal
from typing import Optional

class SaleBase(BaseModel):
    transaction_id: int
    timestamp: datetime
    date: date
    day_of_week: str
    hour: int = Field(..., ge=0, le=23)
    channel: str
    payment_method: str
    product_id: int
    product_name: str
    category: str
    modifier: str = ""
    quantity: int = Field(..., gt=0)
    unit_price: Decimal = Field(..., ge=0, decimal_places=2)
    modifier_price: Decimal = Field(..., ge=0, decimal_places=2)
    total_line: Decimal = Field(..., ge=0, decimal_places=2)
    cost_mxn: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    weather_time: datetime

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    client_id: int
    model_config = ConfigDict(from_attributes=True)
