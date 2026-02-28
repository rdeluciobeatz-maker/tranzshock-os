import Phaser from 'phaser';
import { gameConfig } from './config';
import { Agent } from './agent';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.agents = [];
    this.selectedAgent = null;
    this.cursors = null;
    this.zones = [];
    console.log("🏗️ [MainScene] Constructor con selección única y paso a paso");
  }

  create() {
    console.log("✨ [MainScene] create() - Creando escenario completo");
    
    this.drawFloor();
    this.drawZones();
    this.drawGrid();
    this.createAgents();
    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Evento de clic para selección y movimiento
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
        // SELECCIÓN: Si clickeamos un agente, lo seleccionamos (y deselecciona el anterior)
        this.selectAgent(clickedAgent);
        console.log(`✅ Agente seleccionado: ${clickedAgent.name}`);
      } else if (this.selectedAgent) {
        // MOVIMIENTO PASO A PASO: Mover UNA casilla en la dirección apropiada
        this.moveSelectedAgentOneStep(tileX, tileY);
      }
    });
    
    console.log(`✅ [MainScene] Escenario completo con ${this.agents.length} agentes`);
  }

  selectAgent(agent) {
    // Deseleccionar agente anterior
    if (this.selectedAgent) {
      this.selectedAgent.setSelected(false);
    }
    
    // Seleccionar nuevo agente
    this.selectedAgent = agent;
    agent.setSelected(true);
  }

  moveSelectedAgentOneStep(targetTileX, targetTileY) {
    if (!this.selectedAgent) return;
    
    const currentX = this.selectedAgent.tileX;
    const currentY = this.selectedAgent.tileY;
    
    // Calcular dirección (solo un paso)
    let newX = currentX;
    let newY = currentY;
    
    // Priorizar movimiento en X si la diferencia es mayor
    if (Math.abs(targetTileX - currentX) > Math.abs(targetTileY - currentY)) {
      // Mover en X
      if (targetTileX > currentX) newX = currentX + 1;
      else if (targetTileX < currentX) newX = currentX - 1;
    } else {
      // Mover en Y
      if (targetTileY > currentY) newY = currentY + 1;
      else if (targetTileY < currentY) newY = currentY - 1;
    }
    
    // Verificar límites
    if (newX < 0 || newX >= gameConfig.mapWidth || newY < 0 || newY >= gameConfig.mapHeight) {
      console.log("🚫 No puede moverse fuera del mapa");
      return;
    }
    
    console.log(`👣 ${this.selectedAgent.name} da un paso a [${newX}, ${newY}]`);
    this.selectedAgent.moveTo(newX, newY);
  }

  drawFloor() {
    this.add.rectangle(0, 0, 
      gameConfig.width, gameConfig.height, 
      gameConfig.colors.floor
    ).setOrigin(0);
  }

  drawZones() {
    const graphics = this.add.graphics();
    
    // Zonas con transparencia
    graphics.fillStyle(gameConfig.colors.workstation, 0.3);
    graphics.fillRect(2 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                      8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    graphics.fillStyle(gameConfig.colors.server, 0.3);
    graphics.fillRect(12 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                      8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
    graphics.fillStyle(gameConfig.colors.meeting, 0.3);
    graphics.fillRect(22 * gameConfig.tileSize, 2 * gameConfig.tileSize, 
                      8 * gameConfig.tileSize, 6 * gameConfig.tileSize);
    
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
    
    // Tecla espacio para paso aleatorio
    if (this.cursors && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      if (this.selectedAgent) {
        const randomDir = Math.floor(Math.random() * 4);
        let newX = this.selectedAgent.tileX;
        let newY = this.selectedAgent.tileY;
        
        switch(randomDir) {
          case 0: newX++; break;
          case 1: newX--; break;
          case 2: newY++; break;
          case 3: newY--; break;
        }
        
        if (newX >= 0 && newX < gameConfig.mapWidth && 
            newY >= 0 && newY < gameConfig.mapHeight) {
          console.log(`🎲 Espacio: ${this.selectedAgent.name} paso aleatorio`);
          this.selectedAgent.moveTo(newX, newY);
        }
      } else {
        console.log("⚠️ Selecciona un agente primero");
      }
    }
  }
}
