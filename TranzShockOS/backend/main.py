from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents import Agent, AgentRole, generate_agent_data
from google_sheets import TranzShockSheets
from datetime import datetime
import uvicorn

app = FastAPI(title="Tranz Shock OS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

sheets = TranzShockSheets(sheet_id="sheetbest_id_aqui")

@app.get("/")
async def root():
    return {
        "system": "TRANZ SHOCK OS",
        "version": "2.0",
        "status": "ACTIVE",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/status")
async def get_status():
    return {
        "simulation_status": "ACTIVE",
        "system": "TRANZ SHOCK OS v2.0",
        "agents_online": 4,
        "sheets_connected": True
    }

@app.get("/api/agents", response_model=list[Agent])
async def get_agents():
    agents = []
    for i, role in enumerate(AgentRole):
        agents.append(generate_agent_data(i+1, role))
    return agents

@app.get("/api/presupuestos")
async def get_presupuestos(estado: str = None):
    data = sheets.get_presupuestos(estado)
    return {
        "total": len(data),
        "presupuestos": data,
        "source": "Google Sheets"
    }

@app.post("/api/presupuestos")
async def create_presupuesto(cliente: str, equipo: str, problema: str, monto: float):
    result = sheets.add_presupuesto(cliente, equipo, problema, monto)
    return {
        "message": "✅ Presupuesto guardado",
        "presupuesto": {
            "cliente": cliente,
            "monto": f"${monto}",
            "estado": "PENDIENTE"
        }
    }

@app.get("/api/contabilidad/hoy")
async def get_contabilidad_hoy():
    resumen = sheets.get_contabilidad_hoy()
    alertas = sheets.check_inventario_bajo()
    return {
        "resumen_diario": resumen,
        "alertas_inventario": alertas,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/inventario")
async def get_inventario():
    return {"items": sheets.get_inventario()}

@app.get("/api/inventario/alertas")
async def get_alertas():
    return {"alertas": sheets.check_inventario_bajo()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)