from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Integer,
    BigInteger,
    Numeric,
    String,
    Text,
    JSON,
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func


Base = declarative_base()


class Client(Base):
    __tablename__ = "clients"

    client_id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=True, default=True)
    created_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now())
    subscription_plan = Column(String(100), nullable=True)
    settings = Column(JSON, nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now(), onupdate=func.now())


class User(Base):
    __tablename__ = "users"

    user_id = Column(BigInteger, primary_key=True, index=True)
    client_id = Column(BigInteger, nullable=False, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default="user")
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=True, default=True)
    created_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    client_id = Column(BigInteger, primary_key=True, index=True)
    product_id = Column(BigInteger, primary_key=True, index=True)
    product_name = Column(String(255), nullable=False, index=True)
    category = Column(String(255), nullable=True)
    supplier = Column(String(255), nullable=True)
    cost_mxn = Column(Numeric(12, 2), nullable=False)
    price_mxn = Column(Numeric(12, 2), nullable=False)
    price_delivery = Column(Numeric(12, 2), nullable=True)
    lead_time_days = Column(Integer, nullable=False, default=2)
    safety_stock_days = Column(Numeric(5, 2), nullable=False, default=1.5)
    reorder_point = Column(Integer, nullable=True, default=10)
    created_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now(), onupdate=func.now())


class Sale(Base):
    __tablename__ = "sales"

    client_id = Column(BigInteger, primary_key=True, index=True)
    transaction_id = Column(BigInteger, primary_key=True, index=True)
    timestamp = Column("timestamp", DateTime, primary_key=True, index=True)
    product_id = Column(BigInteger, primary_key=True, index=True)
    modifier = Column(Text, primary_key=True, default="")

    date = Column(Date, nullable=False, index=True)
    day_of_week = Column(Text, nullable=False)
    hour = Column(Integer, nullable=False, index=True)
    channel = Column(Text, nullable=False)
    payment_method = Column(Text, nullable=False)
    product_name = Column(Text, nullable=False)
    category = Column(Text, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    modifier_price = Column(Numeric(10, 2), nullable=False)
    total_line = Column(Numeric(10, 2), nullable=False)
    cost_mxn = Column(Numeric(10, 2), nullable=True)
    weather_time = Column(DateTime, nullable=False)


class InventoryDaily(Base):
    __tablename__ = "inventory_daily"

    client_id = Column(BigInteger, primary_key=True, index=True)
    date = Column(Date, primary_key=True, index=True)
    product_id = Column(BigInteger, primary_key=True, index=True)

    opening_stock = Column(Integer, nullable=True)
    qty_sold = Column(Integer, nullable=True)
    qty_waste = Column(Integer, nullable=True)
    qty_restock = Column(Integer, nullable=True)
    closing_stock = Column(Integer, nullable=True)
    unit_cost = Column(Numeric(12, 2), nullable=True)
    waste_cost = Column(Numeric(12, 2), nullable=True)
    inventory_value = Column(Numeric(12, 2), nullable=True)
    stock_days = Column(Numeric(12, 2), nullable=True)


class WeatherHourly(Base):
    __tablename__ = "weather_hourly"

    time = Column(DateTime(timezone=True), primary_key=True, index=True)
    temperature_c = Column(Numeric(8, 2), nullable=True)
    wind_speed_10m = Column(Numeric(8, 2), nullable=True)
    wind_direction_10m = Column(Integer, nullable=True)
    wind_speed_100m = Column(Numeric(8, 2), nullable=True)
    precipitation_mm = Column(Numeric(8, 2), nullable=True)
    rain_mm = Column(Numeric(8, 2), nullable=True)
    cloud_cover = Column(Numeric(8, 2), nullable=True)
    cloud_cover_low = Column(Integer, nullable=True)
    cloud_cover_mid = Column(Integer, nullable=True)
    cloud_cover_high = Column(Integer, nullable=True)
    snowfall_cm = Column(Numeric(8, 2), nullable=True)
    humidity_percent = Column(Numeric(8, 2), nullable=True)
    apparent_temperature_c = Column(Numeric(8, 2), nullable=True)
    weather_code = Column(Integer, nullable=True)


class CalendarContext(Base):
    __tablename__ = "calendar_context"

    date = Column(Date, primary_key=True, index=True)
    is_holiday = Column(Boolean, nullable=True)
    context_impact_score = Column(Numeric(8, 2), nullable=True)
    event_name = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)


class KPIDaily(Base):
    __tablename__ = "kpi_daily"

    client_id = Column(BigInteger, primary_key=True, index=True)
    date = Column(Date, primary_key=True, index=True)

    transactions = Column(BigInteger, nullable=True)
    units_sold = Column(BigInteger, nullable=True)
    revenue = Column(Numeric(14, 2), nullable=True)
    cost = Column(Numeric(14, 2), nullable=True)
    gross_profit = Column(Numeric(14, 2), nullable=True)


class TopProduct(Base):
    __tablename__ = "kpi_top_products"

    client_id = Column(BigInteger, primary_key=True, index=True)
    product_id = Column(BigInteger, primary_key=True, index=True)

    product_name = Column(String(255), nullable=True)
    category = Column(String(255), nullable=True)
    units_sold = Column(Numeric(14, 2), nullable=True)
    revenue = Column(Numeric(14, 2), nullable=True)


class AssociationRule(Base):
    __tablename__ = "association_rules"

    rule_id = Column(BigInteger, primary_key=True, index=True)
    client_id = Column(BigInteger, nullable=False, index=True)
    antecedent_products = Column(JSON, nullable=False)
    consequent_products = Column(JSON, nullable=False)
    support = Column(Numeric(12, 6), nullable=True)
    confidence = Column(Numeric(12, 6), nullable=True)
    lift = Column(Numeric(12, 6), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now(), onupdate=func.now())


class PriceChangeLog(Base):
    __tablename__ = "price_change_log"

    price_change_id = Column(BigInteger, primary_key=True, index=True)
    client_id = Column(BigInteger, nullable=False, index=True)
    product_id = Column(BigInteger, nullable=False, index=True)
    old_price = Column(Numeric(12, 2), nullable=True)
    new_price = Column(Numeric(12, 2), nullable=True)
    changed_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now())
    reason = Column(Text, nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_log"

    audit_id = Column(BigInteger, primary_key=True, index=True)
    client_id = Column(BigInteger, nullable=True, index=True)
    user_id = Column(BigInteger, nullable=True, index=True)
    action = Column(String(255), nullable=False)
    entity_name = Column(String(255), nullable=True)
    entity_id = Column(String(255), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now())
