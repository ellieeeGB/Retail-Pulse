# Retail Pulse

Retail Pulse es una plataforma de analitica para retail/cafeterias con dashboard, inventario, KPIs, recomendaciones y servicios de ML.

## Estructura

- `api/`: API FastAPI, tareas Celery, modelos ORM y scripts ML.
- `frontend/`: aplicacion React + Vite + Tailwind.
- `data/`: datasets locales. Los CSV se ignoran en Git.
- `models/`: artefactos ML locales. Los `.pkl` y `.joblib` se ignoran en Git.
- `backups/`: dumps SQL locales. Se ignoran en Git.
- `db/migrations/`: scripts de inicializacion o migraciones SQL.

## Configuracion

1. Copia las variables de entorno:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

2. Ajusta secretos reales en `.env`. No subas `.env` a Git.

3. Si necesitas datos o modelos locales, coloca los archivos en `data/`, `models/` o `backups/`.

## Docker

```bash
docker compose up --build
```

Servicios principales:

- Frontend: `http://localhost`
- API: `http://localhost:8000`
- Docs API: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Desarrollo Local

Backend:

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Verificacion

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
python3 -m py_compile $(find api/app -name '*.py' -print)
```
