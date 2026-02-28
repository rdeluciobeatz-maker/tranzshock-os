import Phaser from 'phaser';
import { gameConfig } from './config';
import { Agent } from './agent';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.agents = [];
    this.cursors = null;
    this.zones = [];
    console.log("🏗️ [MainScene] Constructor con escenario completo");
  }

  create() {
    console.log("✨ [MainScene] create() - Creando escenario completo");
    
    // 1. Dibujar el piso base
    this.drawFloor();
    
    // 2. Dibujar zonas especiales
    this.drawZones();
    
    // 3. Dibujar la cuadrícula (opcional, para referencia)
    this.drawGrid();
    
    // 4. Crear agentes en sus estaciones
    this.createAgents();
    
    // 5. Input de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // 6. Evento de clic para mover agentes
    this.input.on('pointerdown', (pointer) => {
      const tileX = Math.floor(pointer.x / gameConfig.tileSize);
      const tileY = Math.floor(pointer.y / gameConfig.tileSize);
      console.log(`🖱️ Click en tile [${tileX}, ${tileY}]`);
      
      // Mover el primer agente al hacer clic
      if (this.agents.length > 0) {
        this.agents[0].moveTo(tileX, tileY);
      }
    });
    
    console.log(`✅ [MainScene] Escenario completo con ${this.agents.length} agentes`);
  }

  drawFloor() {
    // Piso base (toda el área)
    this.add.rectangle(0, 0, 
      gameConfig.width, gameConfig.height, 
      gameConfig.colors.floor
    ).setOrigin(0);
  }

  drawZones() {
    const graphics = this.add.graphics();
    
    // Zona 1: Estaciones de trabajo (izquierda)
    graphics.fillStyle(gameConfig.colors.workstation, 0.3);
    graphics.fillRect(2 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                      8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Zona 2: Sala de servidores (centro)
    graphics.fillStyle(gameConfig.colors.server, 0.3);
    graphics.fillRect(12 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                      8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Zona 3: Área de reuniones (derecha)
    graphics.fillStyle(gameConfig.colors.meeting, 0.3);
    graphics.fillRect(22 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                      8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Zona 4: Área de reparaciones (abajo)
    graphics.fillStyle(gameConfig.colors.repair, 0.3);
    graphics.fillRect(2 * gameConfig.tileSize, 12 * gameConfig.tileSize, 
                      28 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Dibujar bordes de las zonas
    graphics.lineStyle(2, 0x7fff7f, 0.8);
    
    // Estaciones de trabajo
    graphics.strokeRect(2 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                        8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Sala de servidores
    graphics.strokeRect(12 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                        8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Área de reuniones
    graphics.strokeRect(22 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                        8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Área de reparaciones
    graphics.strokeRect(2 * gameConfig.tileSize, 12 * gameConfig.tileSize, 
                        28 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Añadir textos de zona
    this.add.text(3 * gameConfig.tileSize, 3 * gameConfig.tileSize, 'ESTACIONES', {
      fontFamily: 'Share Tech Mono',
      fontSize: '16px',
      color: '#7fff7f'
    });
    
    this.add.text(13 * gameConfig.tileSize, 3 * gameConfig.tileSize, 'SERVIDORES', {
      fontFamily: 'Share Tech Mono',
      fontSize: '16px',
      color: '#7fff7f'
    });
    
    this.add.text(23 * gameConfig.tileSize, 3 * gameConfig.tileSize, 'REUNIONES', {
      fontFamily: 'Share Tech Mono',
      fontSize: '16px',
      color: '#7fff7f'
    });
    
    this.add.text(3 * gameConfig.tileSize, 13 * gameConfig.tileSize, 'REPARACIONES', {
      fontFamily: 'Share Tech Mono',
      fontSize: '16px',
      color: '#7fff7f'
    });
  }

  drawGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x3a5f3a, 0.3);
    
    // Líneas verticales
    for (let i = 0; i <= gameConfig.mapWidth; i++) {
      const x = i * gameConfig.tileSize;
      graphics.moveTo(x, 0);
      graphics.lineTo(x, gameConfig.height);
    }
    
    // Líneas horizontales
    for (let i = 0; i <= gameConfig.mapHeight; i++) {
      const y = i * gameConfig.tileSize;
      graphics.moveTo(0, y);
      graphics.lineTo(gameConfig.width, y);
    }
    
    graphics.strokePath();
  }

  createAgents() {
    // Agente 1 (Manager) en estaciones
    this.createAgent('agent1', 5, 5, gameConfig.colors.agent1, 'MANAGER');
    
    // Agente 2 (Analyst) en servidores
    this.createAgent('agent2', 15, 5, gameConfig.colors.agent2, 'ANALYST');
    
    // Agente 3 (Designer) en reuniones
    this.createAgent('agent3', 25, 5, gameConfig.colors.agent3, 'DESIGNER');
    
    // Agente 4 (Programmer) en reparaciones
    this.createAgent('agent4', 10, 15, gameConfig.colors.agent4, 'PROGRAMMER');
  }

  createAgent(id, x, y, color, name) {
    const agent = new Agent(this, id, x, y, color, name);
    this.agents.push(agent);
    return agent;
  }

  update(time, delta) {
    this.agents.forEach(agent => agent.update(delta / 1000));
    
    // Movimiento con teclado para probar
    if (this.cursors) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
        // Mover agente aleatoriamente por el mapa
        if (this.agents.length > 0) {
          const randomX = Math.floor(Math.random() * gameConfig.mapWidth);
          const randomY = Math.floor(Math.random() * gameConfig.mapHeight);
          this.agents[0].moveTo(randomX, randomY);
        }
      }
    }
  }
}
