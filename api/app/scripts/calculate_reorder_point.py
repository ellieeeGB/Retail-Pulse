import pandas as pd
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)


def get_daily_demand(client_id, product_id, days=30):
    """Obtiene la demanda diaria promedio de los últimos N días para un producto."""
    client_id = int(client_id)
    product_id = int(product_id)
    days = int(days)

    query = text("""
        SELECT date, SUM(quantity) AS daily_demand
        FROM sales
        WHERE client_id = :client_id
          AND product_id = :product_id
          AND date >= CURRENT_DATE - (:days * interval '1 day')
        GROUP BY date
        ORDER BY date
    """)

    df = pd.read_sql(
        query,
        engine,
        params={
            "client_id": client_id,
            "product_id": product_id,
            "days": days
        }
    )

    if df.empty:
        return 0.0

    return float(df["daily_demand"].mean())


def calculate_reorder_point_for_client(client_id):
    client_id = int(client_id)
    print(f"Calculando puntos de reorden para cliente {client_id}...")

    # Obtener todos los productos del cliente
    query_products = text("""
        SELECT product_id, lead_time_days, safety_stock_days
        FROM products
        WHERE client_id = :client_id
    """)

    products = pd.read_sql(query_products, engine, params={"client_id": client_id})

    if products.empty:
        print("No hay productos para este cliente.")
        return

    updates = []

    for _, row in products.iterrows():
        product_id = int(row["product_id"])

        lead_time = row["lead_time_days"]
        safety_days = row["safety_stock_days"]

        lead_time = 0 if pd.isna(lead_time) else int(lead_time)
        safety_days = 0.0 if pd.isna(safety_days) else float(safety_days)

        # Demanda diaria promedio (últimos 30 días)
        avg_demand = get_daily_demand(client_id, product_id, days=30)

        # Punto de reorden simple
        reorder = int(round(avg_demand * lead_time + avg_demand * safety_days))
        if reorder < 0:
            reorder = 0

        updates.append({
            "client_id": client_id,
            "product_id": product_id,
            "reorder_point": reorder
        })

    # Actualizar en lote
    with engine.begin() as conn:
        for upd in updates:
            conn.execute(
                text("""
                    UPDATE products
                    SET reorder_point = :reorder_point
                    WHERE client_id = :client_id
                      AND product_id = :product_id
                """),
                upd
            )

    print(f"Puntos de reorden actualizados para {len(updates)} productos.")


def run_for_all_clients():
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT client_id FROM clients WHERE is_active = true")
        )
        clients = [int(row[0]) for row in result]

    for client_id in clients:
        calculate_reorder_point_for_client(client_id)


if __name__ == "__main__":
    run_for_all_clients()
