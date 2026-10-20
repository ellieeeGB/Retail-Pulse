from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_client_id
from app.crud import kpis as crud
from app.schemas.kpis import KPIDailyResponse, TopProductResponse

router = APIRouter()


@router.get("/daily", response_model=KPIDailyResponse | None)
def get_kpi_daily(
    kpi_date: date = Query(..., description="Fecha del KPI"),
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id),
):
    row = crud.get_kpi_daily(db, client_id, kpi_date)

    if not row:
        return None

    revenue = float(row.revenue or 0)
    gross_profit = float(row.gross_profit or 0)

    return {
        "date": row.date,
        "tickets": int(row.transactions or 0),
        "units_sold": int(row.units_sold or 0),
        "revenue_mxn": revenue,
        "gross_margin_mxn": gross_profit,
        "gross_margin_pct": (gross_profit / revenue * 100) if revenue else 0.0,
        "avg_temp_c": None,
    }


@router.get("/range", response_model=list[KPIDailyResponse])
def get_kpi_range(
    start_date: date = Query(..., description="Fecha inicial"),
    end_date: date = Query(..., description="Fecha final"),
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id),
):
    rows = crud.get_kpi_range(db, client_id, start_date, end_date)

    result = []
    for row in rows:
        revenue = float(row.revenue or 0)
        gross_profit = float(row.gross_profit or 0)

        result.append(
            {
                "date": row.date,
                "tickets": int(row.transactions or 0),
                "units_sold": int(row.units_sold or 0),
                "revenue_mxn": revenue,
                "gross_margin_mxn": gross_profit,
                "gross_margin_pct": (gross_profit / revenue * 100) if revenue else 0.0,
                "avg_temp_c": None,
            }
        )

    return result


@router.get("/top-products", response_model=list[TopProductResponse])
def get_top_products(
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id),
):
    rows = crud.get_top_products(db, client_id, limit)

    result = []
    for row in rows:
        result.append(
            {
                "product_id": int(row.product_id),
                "product_name": row.product_name,
                "category": row.category,
                "units_sold": float(row.units_sold or 0),
                "revenue": float(row.revenue or 0),
            }
        )

    return result
