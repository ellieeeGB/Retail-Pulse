import json
import os
from datetime import datetime
from celery import shared_task
from sqlalchemy import create_engine, text
from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.DATABASE_URL)

@shared_task
def export_recommendations():
    """
    Exporta las mejores reglas de asociación a un archivo JSON que pueda ser
    consumido por el sistema de punto de venta.
    """
    print(f"[{datetime.now()}] Exportando recomendaciones...")
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT
                client_id,
                antecedent_products,
                consequent_products,
                confidence,
                lift
            FROM association_rules
            WHERE lift > 1.5 AND confidence > 0.3
            ORDER BY client_id, lift DESC
        """))
        rows = result.fetchall()

    if not rows:
        print("No hay reglas de asociación para exportar.")
        return

    # Agrupar por cliente
    recommendations_by_client = {}
    for row in rows:
        client_id = row[0]
        if client_id not in recommendations_by_client:
            recommendations_by_client[client_id] = []
        recommendations_by_client[client_id].append({
            "antecedent": json.loads(row[1]),
            "consequent": json.loads(row[2]),
            "confidence": float(row[3]),
            "lift": float(row[4])
        })

    base_path = "/app/data/recommendations"
    os.makedirs(base_path, exist_ok=True)

    for client_id, rules in recommendations_by_client.items():
        filename = f"{base_path}/recommendations_client{client_id}_{datetime.now().strftime('%Y%m%d')}.json"
        with open(filename, 'w') as f:
            json.dump(rules, f, indent=2)
        print(f"Recomendaciones exportadas: {filename}")

    return f"Recomendaciones exportadas para {len(recommendations_by_client)} clientes."
