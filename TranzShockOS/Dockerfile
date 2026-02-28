FROM python:3.11-slim

WORKDIR /app

# Copiar solo requirements.txt primero (para caché)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el contenido de backend
COPY backend/ .

# El comando ahora busca main.py en /app (donde está)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
