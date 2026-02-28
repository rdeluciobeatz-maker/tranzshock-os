import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Activity, Cpu, HardDrive, Wifi,
  Battery, Code,
  DollarSign, AlertTriangle, Package, Clipboard
} from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [agents, setAgents] = useState({});
  const [presupuestos, setPresupuestos] = useState([]);
  const [contabilidad, setContabilidad] = useState({});
  const [alertas, setAlertas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [systemStatus, setSystemStatus] = useState('LOADING');
  const [diagnostico, setDiagnostico] = useState('');
  const [sintomas, setSintomas] = useState('');

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const statusRes = await axios.get(`${API_URL}/api/status`);
      setSystemStatus(statusRes.data.simulation_status);

      const agentsRes = await axios.get(`${API_URL}/api/agents`);
      const agentsMap = {};
      agentsRes.data.forEach(agent => {
        agentsMap[agent.role.toLowerCase()] = agent;
      });
      setAgents(agentsMap);

      const presRes = await axios.get(`${API_URL}/api/presupuestos?estado=pendiente`);
      setPresupuestos(presRes.data.presupuestos || []);

      const contRes = await axios.get(`${API_URL}/api/contabilidad/hoy`);
      setContabilidad(contRes.data.resumen_diario || {});
      setAlertas(contRes.data.alertas_inventario || []);

      const invRes = await axios.get(`${API_URL}/api/inventario`);
      setInventario(invRes.data.items || []);
    } catch (error) {
      console.error('Error:', error);
      setSystemStatus('OFFLINE');
    }
  };

  const handleDiagnostico = () => {
    if (!sintomas) return;
    setDiagnostico(`🔍 DIAGNÓSTICO: Posible falla en ${sintomas} - Presupuesto estimado: $45`);
  };

  const agentIcons = {
    'manager agent': <Activity size={20} />,
    'systems analyst': <Cpu size={20} />,
    'designer agent': <HardDrive size={20} />,
    'programmer agent': <Code size={20} />
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'manager agent': return '#ff5f5f';
      case 'systems analyst': return '#5ff0ff';
      case 'designer agent': return '#aaff5f';
      case 'programmer agent': return '#ffd55f';
      default: return '#7fff7f';
    }
  };

  return (
    <div className="tranzshock-container">
      <div className="header">
        <div className="title">
          <span className="glitch">TRANZ SHOCK</span> OS v2.0
        </div>
        <div className="status-container">
          <Wifi className="icon-green" size={18} />
          <span className={`status-value ${systemStatus === 'ACTIVE' ? 'active' : 'offline'}`}>
            {systemStatus}
          </span>
          <Battery className="icon-green" size={18} />
          <span>100%</span>
        </div>
      </div>

      <div className="agents-grid">
        {Object.entries(agents).map(([key, agent]) => (
          <div key={key} className="agent-card" style={{ borderColor: getRoleColor(agent.role) }}>
            <div className="agent-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {agentIcons[agent.role?.toLowerCase()]}
                <span className="agent-role" style={{ color: getRoleColor(agent.role) }}>
                  {agent.role}
                </span>
              </div>
              <span className="agent-id">ID:{String(agent.id).padStart(2, '0')}</span>
            </div>
            <div className="agent-display">
              <div className="agent-field">
                <span className="field-label">TAREA</span>
                <span className="field-value">{agent.current_task}</span>
              </div>
              <div className="agent-field">
                <span className="field-label">PROGRESO</span>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${agent.progress}%`, backgroundColor: getRoleColor(agent.role) }}></div>
                  <span className="progress-text">{agent.progress}%</span>
                </div>
              </div>
              <div className="agent-field">
                <span className="field-label">FEEDBACK</span>
                <span className="field-value feedback">{agent.last_feedback}</span>
              </div>
              <div className="agent-field">
                <span className="field-label">ULT. UPDATE</span>
                <span className="field-value timestamp">{agent.last_update}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sheets-panel">
        <div className="panel-header">
          <span>📊 GOOGLE SHEETS // LIVE DATA</span>
          <span className="timestamp">ACT: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="sheets-grid">
          <div className="sheet-column">
            <h3><DollarSign size={18} /> CONTABILIDAD HOY</h3>
            {contabilidad && (
              <div className="data-box">
                <div className="data-row"><span>INGRESOS:</span><span className="value-green">${contabilidad.ingresos || 0}</span></div>
                <div className="data-row"><span>EGRESOS:</span><span className="value-red">${contabilidad.egresos || 0}</span></div>
                <div className="data-row total"><span>BALANCE:</span><span className={contabilidad.balance >= 0 ? 'value-green' : 'value-red'}>${contabilidad.balance || 0}</span></div>
              </div>
            )}
            <h3 style={{ marginTop: '20px' }}><Clipboard size={18} /> PRESUPUESTOS</h3>
            <div className="presupuestos-list">
              {presupuestos.length > 0 ? presupuestos.slice(0,5).map((p,i) => (
                <div key={i} className="presupuesto-item">
                  <div className="presupuesto-header"><span>{p.cliente}</span><span className="value-green">${p.monto}</span></div>
                  <div className="presupuesto-detail">{p.equipo} - {p.problema?.substring(0,20)}...</div>
                </div>
              )) : <div className="empty-message">No hay presupuestos pendientes</div>}
            </div>
          </div>
          <div className="sheet-column">
            <h3><Package size={18} /> INVENTARIO // ALERTAS</h3>
            {alertas.length > 0 ? alertas.map((a,i) => (
              <div key={i} className="alerta-item">
                <AlertTriangle color="#ff7f7f" size={18} />
                <div><div className="alerta-producto">{a.producto}</div><div className="alerta-stock">Stock: {a.stock} | Mínimo: {a.minimo}</div></div>
              </div>
            )) : <div className="empty-message">✓ Stock normal</div>}
            <div className="inventario-mini">
              {inventario.slice(0,3).map((item,i) => (
                <div key={i} className="inventario-item">
                  <span>{item.producto}</span>
                  <span className={item.stock <= item.minimo ? 'value-red' : 'value-green'}>{item.stock} uds</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sheet-column">
            <h3><Cpu size={18} /> DIAGNÓSTICO IA</h3>
            <input type="text" value={sintomas} onChange={(e) => setSintomas(e.target.value)} placeholder="Ej: No carga, pantalla rota..." className="diagnosis-input" />
            <button onClick={handleDiagnostico} className="cyber-button">DIAGNOSTICAR</button>
            {diagnostico && <div className="diagnosis-result">{diagnostico}</div>}
          </div>
        </div>
      </div>

      <div className="system-log">
        <div className="log-entry">[14/02-APIDALL(OA)]</div>
        <div className="log-entry">[14/05-DIGIT PROGRAMMINGBUILDGROUD]</div>
        <div className="log-entry">[CONECTADO A GOOGLE SHEETS // LIVE]</div>
        <div className="log-entry">[AGENTES IA: 4 ONLINE]</div>
      </div>
    </div>
  );
}

export default App;