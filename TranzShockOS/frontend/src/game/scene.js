import Phaser from 'phaser';
import { gameConfig } from './config';
import { Agent } from './agent';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.agents = [];
    this.selectedAgent = null; // Agente seleccionado actualmente
    this.cursors = null;
    this.zones = [];
    console.log("🏗️ [MainScene] Constructor con selección de agentes");
  }

  create() {
    console.log("✨ [MainScene] create() - Creando escenario completo");
    
    // 1. Dibujar el piso base
    this.drawFloor();
    
    // 2. Dibujar zonas especiales
    this.drawZones();
    
    // 3. Dibujar la cuadrícula
    this.drawGrid();
    
    // 4. Crear agentes
    this.createAgents();
    
    // 5. Input de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // 6. Evento de clic para SELECCIONAR agentes y mover
    this.input.on('pointerdown', (pointer) => {
      const tileX = Math.floor(pointer.x / gameConfig.tileSize);
      const tileY = Math.floor(pointer.y / gameConfig.tileSize);
      
      // Verificar si clickeamos sobre algún agente
      let clickedAgent = null;
      for (let agent of this.agents) {
        if (agent.tileX === tileX && agent.tileY === tileY) {
          clickedAgent = agent;
          break;
        }
      }
      
      if (clickedAgent) {
        // Si clickeamos un agente, lo seleccionamos
        this.selectAgent(clickedAgent);
        console.log(`✅ Agente seleccionado: ${clickedAgent.name}`);
      } else if (this.selectedAgent) {
        // Si hay un agente seleccionado, lo movemos al tile clickeado
        console.log(`🖱️ Mover ${this.selectedAgent.name} a [${tileX}, ${tileY}]`);
        this.selectedAgent.moveTo(tileX, tileY);
      } else {
        console.log("⚠️ Ningún agente seleccionado. Haz clic en un agente primero.");
      }
    });
    
    console.log(`✅ [MainScene] Escenario completo con ${this.agents.length} agentes`);
  }

  selectAgent(agent) {
    // Desseleccionar agente anterior
    if (this.selectedAgent) {
      this.selectedAgent.setSelected(false);
    }
    
    // Seleccionar nuevo agente
    this.selectedAgent = agent;
    agent.setSelected(true);
  }

  drawFloor() {
    this.add.rectangle(0, 0, 
      gameConfig.width, gameConfig.height, 
      gameConfig.colors.floor
    ).setOrigin(0);
  }

  drawZones() {
    const graphics = this.add.graphics();
    
    // Zona 1: Estaciones de trabajo
    graphics.fillStyle(gameConfig.colors.workstation, 0.3);
    graphics.fillRect(2 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                      8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Zona 2: Sala de servidores
    graphics.fillStyle(gameConfig.colors.server, 0.3);
    graphics.fillRect(12 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                      8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Zona 3: Área de reuniones
    graphics.fillStyle(gameConfig.colors.meeting, 0.3);
    graphics.fillRect(22 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                      8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Zona 4: Área de reparaciones
    graphics.fillStyle(gameConfig.colors.repair, 0.3);
    graphics.fillRect(2 * gameConfig.tileSize, 12 * gameConfig.tileSize, 
                      28 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Bordes
    graphics.lineStyle(2, 0x7fff7f, 0.8);
    graphics.strokeRect(2 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                        8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    graphics.strokeRect(12 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                        8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    graphics.strokeRect(22 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                        8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    graphics.strokeRect(2 * gameConfig.tileSize, 12 * gameConfig.tileSize, 
                        28 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    // Textos
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
    
    for (let i = 0; i <= gameConfig.mapWidth; i++) {
      const x = i * gameConfig.tileSize;
      graphics.moveTo(x, 0);
      graphics.lineTo(x, gameConfig.height);
    }
    
    for (let i = 0; i <= gameConfig.mapHeight; i++) {
      const y = i * gameConfig.tileSize;
      graphics.moveTo(0, y);
      graphics.lineTo(gameConfig.width, y);
    }
    
    graphics.strokePath();
  }

  createAgents() {
    this.createAgent('agent1', 5, 5, gameConfig.colors.agent1, 'MANAGER');
    this.createAgent('agent2', 15, 5, gameConfig.colors.agent2, 'ANALYST');
    this.createAgent('agent3', 25, 5, gameConfig.colors.agent3, 'DESIGNER');
    this.createAgent('agent4', 10, 15, gameConfig.colors.agent4, 'PROGRAMMER');
  }

  createAgent(id, x, y, color, name) {
    const agent = new Agent(this, id, x, y, color, name);
    this.agents.push(agent);
    return agent;
  }

  update(time, delta) {
    this.agents.forEach(agent => agent.update(delta / 1000));
    
    if (this.cursors && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      if (this.selectedAgent) {
        const randomX = Math.floor(Math.random() * gameConfig.mapWidth);
        const randomY = Math.floor(Math.random() * gameConfig.mapHeight);
        console.log(`🎲 Espacio: moviendo ${this.selectedAgent.name} a [${randomX}, ${randomY}]`);
        this.selectedAgent.moveTo(randomX, randomY);
      } else {
        console.log("⚠️ Selecciona un agente primero (clic en él)");
      }
    }
  }
}
