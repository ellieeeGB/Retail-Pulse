from fastapi import APIRouter, Depends, HTTPException, Request
import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_client_id
from app.crud import products as product_crud
from app.crud import inventory as inventory_crud
from app.models.domain import CalendarContext, WeatherHourly

router = APIRouter()

def get_features_for_prediction(db: Session, client_id: int, product_id: int, target_datetime: datetime):
    """
    Recolecta las características necesarias para predecir la demanda de un producto en una fecha/hora específica.
    """
    # Obtener datos de calendario para esa fecha
    cal = db.query(CalendarContext).filter(CalendarContext.date == target_datetime.date()).first()
    if not cal:
        raise HTTPException(status_code=404, detail="Calendar data not found")
    
    # Obtener datos climáticos para esa hora (aproximado)
    weather = db.query(WeatherHourly).filter(
        WeatherHourly.time == target_datetime.replace(minute=0, second=0, microsecond=0)
    ).first()
    
    # Obtener el inventario más reciente para ese producto
    inv = inventory_crud.get_latest_inventory_for_product(db, client_id, product_id)
    
    # Obtener el producto
    product = product_crud.get_product(db, client_id, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Calcular características
    rain_mm = weather.rain_mm if weather and weather.rain_mm is not None else (
        weather.precipitation_mm if weather and weather.precipitation_mm is not None else 0.0
    )

    features = {
        'hour': target_datetime.hour,
        'is_holiday': int(cal.is_holiday),
        'context_impact_score': float(cal.context_impact_score or 0),
        'temperature_c': float(weather.temperature_c) if weather and weather.temperature_c is not None else 20.0,
        'rain_mm': float(rain_mm),
        'cloud_cover': float(weather.cloud_cover) if weather and weather.cloud_cover is not None else 50.0,
        'humidity_percent': float(weather.humidity_percent) if weather and weather.humidity_percent is not None else 70.0,
        'opening_stock': int(inv.closing_stock or 0) if inv else 0,
        'stock_days': float(inv.stock_days or 30) if inv else 30.0,
        'avg_unit_price': float(product.price_mxn),  # o usar precio promedio histórico
    }
    return features

@router.get("/demand/{product_id}")
def predict_demand(
    product_id: int,
    request: Request,
    target_datetime: datetime = None,
    db: Session = Depends(get_db),
    client_id: int = Depends(get_current_client_id),
):
    """
    Predice la demanda de un producto para las próximas 24 horas a partir de target_datetime.
    Si no se proporciona target_datetime, se usa la hora actual.
    """
    if target_datetime is None:
        target_datetime = datetime.now()
    
    # Obtener características
    try:
        features_dict = get_features_for_prediction(db, client_id, product_id, target_datetime)
    except HTTPException as e:
        raise e
    
    # Verificar si el modelo está cargado
    model = request.app.state.model
    if model is None:
        raise HTTPException(status_code=503, detail="Model not available")
    
    # Convertir a DataFrame con el orden correcto de features
    feature_names = request.app.state.features
    df = pd.DataFrame([features_dict])[feature_names]
    
    # Predecir
    prediction = model.predict(df)[0]
    
    # La predicción es la demanda total en las próximas 24 horas (en units_sold)
    return {
        "product_id": product_id,
        "target_datetime": target_datetime.isoformat(),
        "predicted_demand_24h": float(prediction),
        "features_used": features_dict
    }
