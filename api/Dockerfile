# Usa una imagen base oficial de Python 3.11 slim (más pequeña)
FROM python:3.11-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Instala dependencias del sistema necesarias para psycopg2 y otras posibles
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copia primero el archivo de dependencias (aprovecha caché de Docker)
COPY requirements.txt .

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación
COPY . .

# Crea un usuario no root para ejecutar la aplicación (seguridad)
RUN addgroup --system app && adduser --system --group app
USER app

# Expone el puerto que usa FastAPI
EXPOSE 8000

# Comando para ejecutar la aplicación
# Para desarrollo: con --reload
# Para producción: quita --reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
