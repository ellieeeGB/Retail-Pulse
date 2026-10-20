import smtplib
from email.message import EmailMessage
from datetime import datetime
from celery import shared_task
from sqlalchemy import create_engine, text
from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.DATABASE_URL)

@shared_task
def send_low_stock_alerts():
    """
    Envía un email al gerente con los productos que tienen stock bajo.
    """
    print(f"[{datetime.now()}] Verificando stock bajo...")
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT
                p.client_id,
                c.name as client_name,
                p.product_id,
                p.product_name,
                inv.closing_stock as current_stock,
                p.reorder_point
            FROM products p
            JOIN clients c ON p.client_id = c.client_id
            JOIN LATERAL (
                SELECT closing_stock
                FROM inventory_daily
                WHERE client_id = p.client_id AND product_id = p.product_id
                ORDER BY date DESC
                LIMIT 1
            ) inv ON true
            WHERE inv.closing_stock <= p.reorder_point
            ORDER BY c.name, p.product_name
        """))
        rows = result.fetchall()

    if not rows:
        print("No hay alertas de stock bajo.")
        return

    # Agrupar por cliente
    alerts_by_client = {}
    for row in rows:
        client_id = row[0]
        client_name = row[1]
        if client_id not in alerts_by_client:
            alerts_by_client[client_id] = {
                "client_name": client_name,
                "products": []
            }
        alerts_by_client[client_id]["products"].append({
            "product_name": row[3],
            "current_stock": row[4],
            "reorder_point": row[5]
        })

    # Enviar un email por cliente (al gerente correspondiente)
    # Por simplicidad, usamos un email fijo de .env, pero idealmente cada cliente tendría su email.
    for client_id, data in alerts_by_client.items():
        msg = EmailMessage()
        msg["Subject"] = f"[Retail Pulse] Alerta de Stock Bajo - {data['client_name']}"
        msg["From"] = settings.SMTP_USER
        msg["To"] = settings.ALERT_EMAIL  # Aquí deberías obtener el email del gerente del cliente

        body = f"Hola,\n\nLos siguientes productos tienen stock bajo en {data['client_name']}:\n\n"
        for p in data["products"]:
            body += f"- {p['product_name']}: Stock actual {p['current_stock']}, Punto de reorden {p['reorder_point']}\n"
        body += "\nPor favor, revisa y genera las órdenes de compra necesarias.\n\nSaludos,\nSistema Retail Pulse"
        msg.set_content(body)

        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            print(f"Alerta enviada a {settings.ALERT_EMAIL} para cliente {client_id}")
        except Exception as e:
            print(f"Error enviando email: {e}")

    return f"Alertas enviadas para {len(alerts_by_client)} clientes."
