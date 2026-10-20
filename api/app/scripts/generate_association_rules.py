import pandas as pd
from sqlalchemy import create_engine, text
from mlxtend.frequent_patterns import apriori, association_rules
import os
from dotenv import load_dotenv
import json

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)


def get_transactions(client_id):
    """Obtiene todas las transacciones de un cliente, agrupadas por transaction_id."""
    query = text("""
        SELECT transaction_id, product_id
        FROM sales
        WHERE client_id = :client_id
        ORDER BY transaction_id
    """)
    df = pd.read_sql(query, engine, params={"client_id": client_id})

    # One-hot encoding por transacción
    basket = df.groupby(["transaction_id", "product_id"]).size().unstack(fill_value=0)

    # Convertir a booleano para mlxtend
    basket = (basket > 0)

    return basket


def generate_rules_for_client(client_id):
    print(f"Generando reglas para cliente {client_id}...")
    basket = get_transactions(client_id)

    if basket.empty:
        print("No hay transacciones para este cliente.")
        return

    print(f"Transacciones: {basket.shape[0]}")
    print(f"Productos únicos: {basket.shape[1]}")

    # Bajamos el soporte para encontrar más combinaciones
    frequent_itemsets = apriori(
        basket,
        min_support=0.0005,
        use_colnames=True
    )

    if frequent_itemsets.empty:
        print("No se encontraron itemsets frecuentes.")
        return

    # Tamaño de itemsets
    frequent_itemsets["itemset_size"] = frequent_itemsets["itemsets"].apply(len)

    print("Conteo por tamaño de itemset:")
    print(frequent_itemsets["itemset_size"].value_counts().sort_index())

    pair_itemsets = frequent_itemsets[frequent_itemsets["itemset_size"] >= 2]
    print(f"Itemsets de 2 o más productos: {len(pair_itemsets)}")

    if not pair_itemsets.empty:
        print("Top itemsets de 2 o más productos:")
        print(
            pair_itemsets[["support", "itemsets"]]
            .sort_values("support", ascending=False)
            .head(20)
        )

    print(f"Itemsets frecuentes encontrados: {len(frequent_itemsets)}")

    if pair_itemsets.empty:
        print("No hay combinaciones frecuentes de 2 o más productos.")
        return

    # Generar reglas con el filtro más permisivo posible
    rules = association_rules(
        frequent_itemsets,
        metric="support",
        min_threshold=0.0
    )

    print(f"Total reglas brutas: {len(rules)}")

    if rules.empty:
        print("No se encontraron reglas con los umbrales actuales.")
        return

    # Filtro suave para dejar reglas útiles
    rules = rules[
        (rules["confidence"] >= 0.01) &
        (rules["lift"] >= 1.0)
    ].copy()

    if rules.empty:
        print("No se encontraron reglas después del filtro de confidence/lift.")
        return

    rules = rules.sort_values(["lift", "confidence", "support"], ascending=False)

    print("Primeras reglas encontradas:")
    print(
        rules[["antecedents", "consequents", "support", "confidence", "lift"]]
        .head(20)
    )

    # Preparar para insertar
    rules_to_insert = []
    for _, row in rules.iterrows():
        antecedents = [int(x) for x in row["antecedents"]]
        consequents = [int(x) for x in row["consequents"]]

        rules_to_insert.append({
            "client_id": client_id,
            "antecedent_products": json.dumps(antecedents),
            "consequent_products": json.dumps(consequents),
            "support": float(row["support"]),
            "confidence": float(row["confidence"]),
            "lift": float(row["lift"])
        })

    # Insertar en la base
    with engine.begin() as conn:
        conn.execute(
            text("DELETE FROM association_rules WHERE client_id = :client_id"),
            {"client_id": client_id}
        )

        for rule in rules_to_insert:
            conn.execute(
                text("""
                    INSERT INTO association_rules (
                        client_id,
                        antecedent_products,
                        consequent_products,
                        support,
                        confidence,
                        lift
                    )
                    VALUES (
                        :client_id,
                        :antecedent_products,
                        :consequent_products,
                        :support,
                        :confidence,
                        :lift
                    )
                """),
                rule
            )

    print(f"Reglas generadas para cliente {client_id}: {len(rules_to_insert)}")


def run_for_all_clients():
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT client_id FROM clients WHERE is_active = true")
        )
        clients = [row[0] for row in result]

    for client_id in clients:
        generate_rules_for_client(client_id)


if __name__ == "__main__":
    run_for_all_clients()
