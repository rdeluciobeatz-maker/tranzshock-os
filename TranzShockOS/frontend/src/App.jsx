import React, { useEffect, useRef } from 'react';
import { initGame } from './game/main';
import './App.css';

function App() {
  const gameRef = useRef(null);
  const gameContainerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameRef.current && gameContainerRef.current) {
        console.log("🚀 Iniciando juego Phaser...");
        gameRef.current = initGame(gameContainerRef.current);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="tranzshock-container">
      <div className="header">
        <div className="title">
          <span className="glitch">TRANZ SHOCK</span> OS v4.0
        </div>
        <div className="status-container">
          <span className="status-value active">OFICINA ACTIVA</span>
        </div>
      </div>

      <div 
        ref={gameContainerRef} 
        className="game-container"
      />

      <div className="system-log">
        <div className="log-entry">[MAPA: 32x24]</div>
        <div className="log-entry">[ZONAS: 4 ACTIVAS]</div>
        <div className="log-entry">[AGENTES: 4 ONLINE]</div>
        <div className="log-entry">[CLICK PARA MOVER]</div>
        <div className="log-entry">[ESPACIO: MOVER ALEATORIO]</div>
      </div>
    </div>
  );
}

export default App;
