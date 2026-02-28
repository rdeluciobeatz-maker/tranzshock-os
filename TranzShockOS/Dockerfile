FROM python:3.11-slim

WORKDIR /app

# Copiar requirements.txt desde TranzShockOS/backend/
COPY TranzShockOS/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el backend desde TranzShockOS/backend/
COPY TranzShockOS/backend/ .

CMD uvicorn main:app --host 0.0.0.0 --port $PORT
