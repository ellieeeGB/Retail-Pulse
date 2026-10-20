from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class RecommendationRequest(BaseModel):
    product_ids: List[int] = []


class Recommendation(BaseModel):
    product_id: int
    product_name: str
    confidence: float
    lift: float


class BusinessRecommendation(BaseModel):
    kind: str
    product_name: str
    confidence: float
    lift: float
    strength: str
    context: str
    support_abs: int
    significant: bool
    opportunity_level: str
    message: str
    action: str


class WasteRiskAlert(BaseModel):
    kind: str
    product_name: str
    confidence: float
    lift: float
    strength: str
    context: str
    support_abs: int
    significant: bool
    waste_total: float
    risk_level: str
    message: str
    action: str


class RecommendationSummary(BaseModel):
    metadata: Dict[str, Any] = {}
    sales_recommendations: List[BusinessRecommendation] = []
    waste_risk_alerts: List[WasteRiskAlert] = []
