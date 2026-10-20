import os
import joblib
import pandas as pd
from functools import lru_cache


MODEL_PATH = os.getenv("APRIORI_MODEL_PATH", "/app/models/retailpulse_apriori_v6.pkl")


def _clean_strength(value: str | None) -> str:
    if not value:
        return "Sin clasificar"
    return (
        str(value)
        .replace("✅", "")
        .replace("⚠️", "")
        .replace("❌", "")
        .strip()
        .title()
    )


def _clean_significance(value: str | None) -> bool:
    if value is None:
        return False
    return "SÍ" in str(value).upper() or "SI" in str(value).upper()


def _describe_opportunity(confidence: float, lift: float) -> str:
    if confidence >= 0.08 or lift >= 1.20:
        return "Alta"
    if confidence >= 0.04 or lift >= 1.08:
        return "Media"
    return "Exploratoria"


def _build_action_for_sales(product_name: str, context: str, strength: str) -> str:
    if "to-go" in context.lower():
        return f"Sugerir {product_name} en caja o en pedidos para llevar."
    if "quincena" in context.lower():
        return f"Promover {product_name} en días de mayor movimiento o campañas temporales."
    if "waste" in context.lower() or "merma" in context.lower():
        return f"Usar {product_name} en combo o sugerencia rápida para aumentar salida."
    if strength.lower() == "fuerte":
        return f"Crear una sugerencia directa o combo con {product_name}."
    return f"Probar {product_name} como recomendación comercial en caja o menú."

def _build_action_for_waste(product_name: str, context: str, waste_total: float) -> str:
    if "waste" in context.lower() or "merma" in context.lower():
        return (
            f"Revisar rotación, producción y salida de {product_name}. "
            f"Hay señales asociadas a merma acumulada."
        )
    if waste_total > 0:
        return f"Monitorear {product_name} y ajustar producción o promociones para evitar desperdicio."
    return f"Revisar inventario y comportamiento operativo de {product_name}."


class AprioriEngine:
    def __init__(self, model_path: str = MODEL_PATH):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Modelo Apriori no encontrado en {model_path}")

        artifact = joblib.load(model_path)

        self.metadata = artifact.get("metadata", {})
        self.config = artifact.get("config", {})
        self.rules_sales: pd.DataFrame = artifact.get("reglas_sig", pd.DataFrame()).copy()
        self.rules_waste: pd.DataFrame = artifact.get("reglas_merma", pd.DataFrame()).copy()

        self._prepare_dataframes()

    def _prepare_dataframes(self):
        if not self.rules_sales.empty:
            self.rules_sales["significativa_bool"] = self.rules_sales["significativa"].apply(_clean_significance)
            self.rules_sales["fuerza_limpia"] = self.rules_sales["fuerza"].apply(_clean_strength)

        if not self.rules_waste.empty:
            self.rules_waste["significativa_bool"] = self.rules_waste["significativa"].apply(_clean_significance)
            self.rules_waste["fuerza_limpia"] = self.rules_waste["fuerza"].apply(_clean_strength)

    def get_sales_recommendations(self, limit: int = 6):
        if self.rules_sales.empty:
            return []

        df = self.rules_sales.copy()
        df = df[df["significativa_bool"] == True]
        df = df.sort_values(
            by=["lift", "confidence", "soporte_abs"],
            ascending=[False, False, False]
        )

        results = []
        used_products = set()

        for _, row in df.iterrows():
            product_name = str(row.get("producto_target", "")).strip()
            if not product_name or product_name in used_products:
                continue

            confidence = float(row.get("confidence", 0) or 0)
            lift = float(row.get("lift", 0) or 0)
            strength = row.get("fuerza_limpia", "Sin clasificar")
            context = str(row.get("antecedents_str", "") or "")
            support_abs = int(row.get("soporte_abs", 0) or 0)
            significance = bool(row.get("significativa_bool", False))

            results.append({
                "kind": "venta_cruzada",
                "product_name": product_name,
                "confidence": confidence,
                "lift": lift,
                "strength": strength,
                "context": context,
                "support_abs": support_abs,
                "significant": significance,
                "opportunity_level": _describe_opportunity(confidence, lift),
                "message": f"Sugerir {product_name} cuando aparezca este patrón de contexto.",
                "action": _build_action_for_sales(product_name, context, strength),
            })

            used_products.add(product_name)

            if len(results) >= limit:
                break

        return results

    def get_waste_risk_alerts(self, limit: int = 6):
        if self.rules_waste.empty:
            return []

        df = self.rules_waste.copy()
        df = df[df["significativa_bool"] == True]
        df = df.sort_values(
            by=["merma_total", "lift", "confidence"],
            ascending=[False, False, False]
        )

        results = []
        used_products = set()

        for _, row in df.iterrows():
            product_name = str(row.get("producto_target", "")).strip()
            if not product_name or product_name in used_products:
                continue

            confidence = float(row.get("confidence", 0) or 0)
            lift = float(row.get("lift", 0) or 0)
            strength = row.get("fuerza_limpia", "Sin clasificar")
            context = str(row.get("antecedents_str", "") or "")
            support_abs = int(row.get("soporte_abs", 0) or 0)
            significance = bool(row.get("significativa_bool", False))
            waste_total = float(row.get("merma_total", 0) or 0)

            results.append({
                "kind": "riesgo_merma",
                "product_name": product_name,
                "confidence": confidence,
                "lift": lift,
                "strength": strength,
                "context": context,
                "support_abs": support_abs,
                "significant": significance,
                "waste_total": waste_total,
                "risk_level": "Alto" if waste_total >= 3000 else "Medio" if waste_total >= 1000 else "Bajo",
                "message": f"{product_name} aparece ligado a condiciones asociadas a merma.",
                "action": _build_action_for_waste(product_name, context, waste_total),
            })

            used_products.add(product_name)

            if len(results) >= limit:
                break

        return results

    def get_summary(self, sales_limit: int = 6, waste_limit: int = 6):
        return {
            "metadata": self.metadata,
            "sales_recommendations": self.get_sales_recommendations(limit=sales_limit),
            "waste_risk_alerts": self.get_waste_risk_alerts(limit=waste_limit),
        }


@lru_cache(maxsize=1)
def get_apriori_engine() -> AprioriEngine:
    return AprioriEngine()
