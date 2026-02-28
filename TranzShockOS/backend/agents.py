from pydantic import BaseModel
from enum import Enum
import random
import datetime

class AgentRole(str, Enum):
    manager = "MANAGER AGENT"
    analyst = "SYSTEMS ANALYST"
    designer = "DESIGNER AGENT"
    programmer = "PROGRAMMER AGENT"

class Agent(BaseModel):
    id: int
    role: AgentRole
    status: str = "ACTIVE"
    progress: int
    current_task: str
    last_feedback: str
    last_update: str

def generate_agent_data(agent_id: int, role: AgentRole):
    tasks = {
        AgentRole.manager: ["Revisando KPI", "Asignando reparación", "Generando reporte"],
        AgentRole.analyst: ["Diagnóstico de placa", "Análisis de error", "Escaneo de componentes"],
        AgentRole.designer: ["Diseñando UI para cliente", "Prototipo de app", "Renderizando 3D"],
        AgentRole.programmer: ["Compilando código", "Debugging Android", "Optimizando BD"]
    }
    feedbacks = {
        AgentRole.manager: "VENTAS +15% // COSTOS -5%",
        AgentRole.analyst: "FALLA COMUN: CONECTOR CARGA",
        AgentRole.designer: "FEEDBACK: CLIENTE APROBÓ",
        AgentRole.programmer: "BUILD 14/05 COMPLETADO"
    }
    return Agent(
        id=agent_id,
        role=role,
        progress=random.randint(30, 95),
        current_task=random.choice(tasks[role]),
        last_feedback=feedbacks[role],
        last_update=datetime.datetime.now().strftime("%d/%m-%H:%M")
    )