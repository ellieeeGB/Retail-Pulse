import csv
from pathlib import Path

SRC = Path("data/open-meteo-20.56N100.43W1825m.csv")
DST = Path("data/weather_hourly_clean.csv")

lines = SRC.read_text(encoding="utf-8").splitlines()

start = None
for i, line in enumerate(lines):
    if line.startswith("time,"):
        start = i
        break

if start is None:
    raise SystemExit("No se encontró la línea que empieza con 'time,'")

def clean(col):
    col = col.strip()
    col = col.replace(" (°C)", "")
    col = col.replace(" (km/h)", "")
    col = col.replace(" (°)", "")
    col = col.replace(" (%)", "")
    col = col.replace(" (mm)", "")
    col = col.replace(" (cm)", "")
    col = col.replace(" (wmo code)", "")
    col = col.replace(" ", "_")
    return col

header = [clean(c) for c in lines[start].split(",")]

expected = [
    "time","temperature_2m","wind_speed_10m","wind_direction_10m","wind_speed_100m",
    "cloud_cover","cloud_cover_low","cloud_cover_mid","cloud_cover_high",
    "rain","precipitation","snowfall","relative_humidity_2m",
    "apparent_temperature","weather_code"
]

if header != expected:
    raise SystemExit(f"Header inesperado:\n{header}")

with DST.open("w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(expected)
    for row in csv.reader(lines[start+1:]):
        if row:
            writer.writerow(row)

print("Archivo weather_hourly_clean.csv creado correctamente")
