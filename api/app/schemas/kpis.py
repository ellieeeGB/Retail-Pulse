from pydantic import BaseModel
from datetime import date
from decimal import Decimal


class KPIDailyResponse(BaseModel):
    date: date
    tickets: int
    units_sold: int
    revenue_mxn: float
    gross_margin_mxn: float
    gross_margin_pct: float
    avg_temp_c: float | None = None

    class Config:
        from_attributes = True


class TopProductResponse(BaseModel):
    product_id: int
    product_name: str
    category: str | None = None
    units_sold: float
    revenue: float

    class Config:
        from_attributes = True
