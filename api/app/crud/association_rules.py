from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.domain import AssociationRule
from typing import List


def get_recommendations(db: Session, client_id: int, product_ids: List[int], limit: int = 5):
    """
    Busca reglas donde el antecedente contenga alguno de los productos dados.
    Como antecedent_products es un JSONB array de enteros, usamos jsonb_array_elements_text
    para comparar correctamente.
    """
    if not product_ids:
        return []

    product_ids = [int(pid) for pid in product_ids]

    sql = text("""
        SELECT
            rule_id,
            client_id,
            antecedent_products,
            consequent_products,
            support,
            confidence,
            lift,
            created_at,
            updated_at
        FROM association_rules
        WHERE client_id = :client_id
          AND EXISTS (
              SELECT 1
              FROM jsonb_array_elements_text(antecedent_products) AS elem
              WHERE (elem)::int = ANY(:product_ids)
          )
        ORDER BY lift DESC, confidence DESC
        LIMIT :limit
    """)

    rows = db.execute(
        sql,
        {
            "client_id": client_id,
            "product_ids": product_ids,
            "limit": limit,
        }
    ).mappings().all()

    results = []
    for row in rows:
        results.append(
            AssociationRule(
                rule_id=row["rule_id"],
                client_id=row["client_id"],
                antecedent_products=row["antecedent_products"],
                consequent_products=row["consequent_products"],
                support=row["support"],
                confidence=row["confidence"],
                lift=row["lift"],
                created_at=row["created_at"],
                updated_at=row["updated_at"],
            )
        )

    return results
