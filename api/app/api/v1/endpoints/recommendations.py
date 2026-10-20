from fastapi import APIRouter, Depends
from typing import List

from app.schemas.recommendations import (
    RecommendationRequest,
    Recommendation,
    RecommendationSummary,
)
from app.services.apriori_engine import get_apriori_engine, AprioriEngine

router = APIRouter()


@router.post("/", response_model=List[Recommendation])
def get_recommendations(
    request: RecommendationRequest,
    engine: AprioriEngine = Depends(get_apriori_engine),
):
    """
    Endpoint compatible con el frontend actual del dashboard.
    Devuelve una lista simple de recomendaciones de venta cruzada.
    """
    data = engine.get_sales_recommendations(limit=5)

    result = []
    for idx, item in enumerate(data, start=1):
        result.append(
            Recommendation(
                product_id=idx,
                product_name=item["product_name"],
                confidence=item["confidence"],
                lift=item["lift"],
            )
        )

    return result


@router.get("/summary", response_model=RecommendationSummary)
def get_recommendation_summary(
    engine: AprioriEngine = Depends(get_apriori_engine),
):
    """
    Endpoint enriquecido para el nuevo frontend:
    - recomendaciones de venta
    - alertas de merma
    - metadatos del modelo
    """
    return engine.get_summary(sales_limit=6, waste_limit=6)
