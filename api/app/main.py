from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, products, sales, inventory, kpis, predict, recommendations
from app.core.config import get_settings
import joblib
import os

settings = get_settings()

app = FastAPI(
    title="Retail Pulse API",
    description="API para la gestión cognitiva de cafeterías",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def load_models():
    # Modelo de pronóstico
    forecast_model_path = os.getenv("MODEL_PATH", "/app/models/demand_forecast_xgb.pkl")
    forecast_features_path = os.getenv("FEATURES_PATH", "/app/models/features.pkl")

    if os.path.exists(forecast_model_path) and os.path.exists(forecast_features_path):
        try:
            app.state.model = joblib.load(forecast_model_path)
            app.state.features = joblib.load(forecast_features_path)
            print(f"✅ Modelo de pronóstico cargado desde {forecast_model_path}")
        except Exception as e:
            app.state.model = None
            app.state.features = []
            print(f"⚠️ Error cargando modelo de pronóstico: {e}")
    else:
        app.state.model = None
        app.state.features = []
        print("ℹ️ No se encontró modelo de pronóstico. Se usará predicción dummy.")

    # Modelo Apriori
    apriori_model_path = os.getenv("APRIORI_MODEL_PATH", "/app/models/retailpulse_apriori_v6.pkl")

    if os.path.exists(apriori_model_path):
        try:
            app.state.apriori_model = joblib.load(apriori_model_path)
            print(f"✅ Modelo Apriori cargado desde {apriori_model_path}")
        except Exception as e:
            app.state.apriori_model = None
            print(f"⚠️ Error cargando modelo Apriori: {e}")
    else:
        app.state.apriori_model = None
        print("ℹ️ No se encontró modelo Apriori.")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(sales.router, prefix="/api/v1/sales", tags=["sales"])
app.include_router(inventory.router, prefix="/api/v1/inventory", tags=["inventory"])
app.include_router(kpis.router, prefix="/api/v1/kpis", tags=["kpis"])
app.include_router(predict.router, prefix="/api/v1/predict", tags=["predict"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a Retail Pulse API"}
