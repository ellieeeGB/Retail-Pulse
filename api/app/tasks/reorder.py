import csv
import os
from datetime import datetime
from celery import shared_task
from sqlalchemy import create_engine, text
from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.DATABASE_URL)

@shared_task
def generate_purchase_orders():
    """
    Tarea programada para generar órdenes de compra basadas en el punto de reorden.
    Se ejecutará, por ejemplo, una vez al día.
    """
    print(f"[{datetime.now()}] Generando órdenes de compra...")
    with engine.connect() as conn:
        # Esta consulta asume que tienes una columna 'reorder_point' en 'products'
        # y que 'inventory_daily' tiene el stock más reciente.
        # Si no, ajústala a tu lógica.
        result = conn.execute(text("""
            SELECT
                p.client_id,
                p.product_id,
                p.product_name,
                p.supplier,
                inv.closing_stock as current_stock,
                p.reorder_point,
                (p.reorder_point - inv.closing_stock) as suggested_order_qty
            FROM products p
            JOIN LATERAL (
                SELECT closing_stock
                FROM inventory_daily
                WHERE client_id = p.client_id AND product_id = p.product_id
                ORDER BY date DESC
                LIMIT 1
            ) inv ON true
            WHERE inv.closing_stock <= p.reorder_point
            ORDER BY p.client_id, p.supplier
        """))

        rows = result.fetchall()

    if not rows:
        print("No hay productos que necesiten reorden.")
        return

    # Agrupar por cliente y proveedor para generar archivos separados
    orders = {}
    for row in rows:
        client_id = row[0]
        supplier = row[3]
        key = (client_id, supplier)
        if key not in orders:
            orders[key] = []
        orders[key].append({
            "product_id": row[1],
            "product_name": row[2],
            "current_stock": row[4],
            "reorder_point": row[5],
            "suggested_qty": max(0, row[6])  # Asegurar que no sea negativo
        })

    # Generar un archivo CSV por cada (cliente, proveedor)
    base_path = "/app/data/purchase_orders"  # Asegúrate de que esta carpeta exista
    os.makedirs(base_path, exist_ok=True)

    for (client_id, supplier), items in orders.items():
        filename = f"{base_path}/po_client{client_id}_{supplier}_{datetime.now().strftime('%Y%m%d')}.csv"
        with open(filename, 'w', newline='') as csvfile:
            fieldnames = ["product_id", "product_name", "current_stock", "reorder_point", "suggested_qty"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for item in items:
                writer.writerow(item)
        print(f"Orden generada: {filename}")

    # También podrías enviar estos archivos por email a los proveedores (tarea separada)
    return f"Se generaron {len(orders)} órdenes de compra."
