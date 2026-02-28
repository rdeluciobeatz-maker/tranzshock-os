FROM python:3.11-slim

WORKDIR /app

# Copiar requirements.txt desde backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del backend
COPY backend/ .

CMD uvicorn main:app --host 0.0.0.0 --port $PORT
