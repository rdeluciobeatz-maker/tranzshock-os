import React, { useEffect, useRef } from 'react';
import { initGame } from './game/main';
import './App.css';

function App() {
  const gameRef = useRef(null);
  const gameContainerRef = useRef(null);

  useEffect(() => {
    // Pequeño retraso para asegurar que el DOM está listo
    const timer = setTimeout(() => {
      if (!gameRef.current && gameContainerRef.current) {
        console.log("🚀 Iniciando juego Phaser...");
        console.log("📦 Contenedor:", gameContainerRef.current);
        gameRef.current = initGame(gameContainerRef.current);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (gameRef.current) {
        console.log("🛑 Destruyendo juego");
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="tranzshock-container">
      <div className="header">
        <div className="title">
          <span className="glitch">TRANZ SHOCK</span> OS v3.0
        </div>
        <div className="status-container">
          <span className="status-value active">MAPA ACTIVO</span>
        </div>
      </div>
      
      <div 
        ref={gameContainerRef} 
        className="game-container"
        style={{
          border: '2px solid #3a5f3a',
          margin: '20px 0',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
          backgroundColor: '#0f130f',
          minHeight: '600px'
        }}
      />
      
      <div className="system-log">
        <div className="log-entry">[MAPA: 25x18]</div>
        <div className="log-entry">[AGENTES: 2 ACTIVOS]</div>
        <div className="log-entry">[CLICK PARA MOVER MANAGER]</div>
        <div className="log-entry">[ESPACIO: MOVER ALEATORIO]</div>
        <div className="log-entry">[PHASER: CARGANDO...]</div>
      </div>
    </div>
  );
}

export default App;
