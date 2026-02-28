FROM python:3.11-slim

WORKDIR /app

# Copiar requirements.txt desde la carpeta backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el contenido de backend
COPY backend/ .

# Ejecutar la app (main.py está en /app)
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
