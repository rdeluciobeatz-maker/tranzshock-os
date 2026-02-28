import Phaser from 'phaser';
import { gameConfig } from './config';
import { Agent } from './agent';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.agents = [];
    this.selectedAgent = null;
    this.cursors = null;
    console.log("🏗️ [MainScene] Constructor");
  }

  create() {
    console.log("✨ [MainScene] create()");
    
    this.drawFloor();
    this.drawZones();
    this.drawGrid();
    this.createAgents();
    
    // Mostrar límites del mapa
    this.drawBoundary();
    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.input.on('pointerdown', (pointer) => {
      const tileX = Math.floor(pointer.x / gameConfig.tileSize);
      const tileY = Math.floor(pointer.y / gameConfig.tileSize);
      
      // Verificar si está dentro del mapa
      if (tileX < 0 || tileX >= gameConfig.mapWidth || 
          tileY < 0 || tileY >= gameConfig.mapHeight) {
        console.log("🚫 Click fuera del mapa");
        return;
      }
      
      let clickedAgent = null;
      for (let agent of this.agents) {
        if (agent.tileX === tileX && agent.tileY === tileY) {
          clickedAgent = agent;
          break;
        }
      }
      
      if (clickedAgent) {
        if (this.selectedAgent) {
          this.selectedAgent.setSelected(false);
        }
        this.selectedAgent = clickedAgent;
        this.selectedAgent.setSelected(true);
        console.log(`✅ Seleccionado: ${clickedAgent.name}`);
      } else if (this.selectedAgent) {
        this.moveAgentTo(this.selectedAgent, tileX, tileY);
      }
    });
    
    console.log(`✅ Escenario listo con ${this.agents.length} agentes`);
  }

  drawBoundary() {
    // Dibujar un borde rojo alrededor del mapa (solo para referencia)
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xff0000, 0.5);
    graphics.strokeRect(0, 0, gameConfig.width, gameConfig.height);
  }

  moveAgentTo(agent, targetX, targetY) {
    if (agent.tileX === targetX && agent.tileY === targetY) return;
    
    const path = this.findPath(agent.tileX, agent.tileY, targetX, targetY);
    
    if (path && path.length > 1) {
      const nextStep = path[1];
      agent.moveTo(nextStep.x, nextStep.y);
    }
  }

  findPath(startX, startY, targetX, targetY) {
    const queue = [{ x: startX, y: startY, path: [{ x: startX, y: startY }] }];
    const visited = new Set();
    visited.add(`${startX},${startY}`);
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current.x === targetX && current.y === targetY) {
        return current.path;
      }
      
      const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
      ];
      
      for (const dir of directions) {
        const newX = current.x + dir.dx;
        const newY = current.y + dir.dy;
        const key = `${newX},${newY}`;
        
        if (newX >= 0 && newX < gameConfig.mapWidth && 
            newY >= 0 && newY < gameConfig.mapHeight && 
            !visited.has(key)) {
          
          visited.add(key);
          const newPath = [...current.path, { x: newX, y: newY }];
          queue.push({ x: newX, y: newY, path: newPath });
        }
      }
    }
    return null;
  }

  drawFloor() {
    this.add.rectangle(0, 0, gameConfig.width, gameConfig.height, gameConfig.colors.floor).setOrigin(0);
  }

  drawZones() {
    const graphics = this.add.graphics();
    
    graphics.fillStyle(gameConfig.colors.workstation, 0.3);
    graphics.fillRect(2 * 32, 2 * 32, 8 * 32, 6 * 32);
    graphics.fillStyle(gameConfig.colors.server, 0.3);
    graphics.fillRect(12 * 32, 2 * 32, 8 * 32, 6 * 32);
    graphics.fillStyle(gameConfig.colors.meeting, 0.3);
    graphics.fillRect(22 * 32, 2 * 32, 8 * 32, 6 * 32);
    graphics.fillStyle(gameConfig.colors.repair, 0.3);
    graphics.fillRect(2 * 32, 12 * 32, 28 * 32, 6 * 32);
    
    graphics.lineStyle(2, 0x7fff7f, 0.8);
    graphics.strokeRect(2 * 32, 2 * 32, 8 * 32, 6 * 32);
    graphics.strokeRect(12 * 32, 2 * 32, 8 * 32, 6 * 32);
    graphics.strokeRect(22 * 32, 2 * 32, 8 * 32, 6 * 32);
    graphics.strokeRect(2 * 32, 12 * 32, 28 * 32, 6 * 32);
    
    this.add.text(3 * 32, 3 * 32, 'ESTACIONES', { fontFamily: 'Share Tech Mono', fontSize: '16px', color: '#7fff7f' });
    this.add.text(13 * 32, 3 * 32, 'SERVIDORES', { fontFamily: 'Share Tech Mono', fontSize: '16px', color: '#7fff7f' });
    this.add.text(23 * 32, 3 * 32, 'REUNIONES', { fontFamily: 'Share Tech Mono', fontSize: '16px', color: '#7fff7f' });
    this.add.text(3 * 32, 13 * 32, 'REPARACIONES', { fontFamily: 'Share Tech Mono', fontSize: '16px', color: '#7fff7f' });
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
    
    if (this.selectedAgent && this.cursors) {
      let moved = false;
      let newX = this.selectedAgent.tileX;
      let newY = this.selectedAgent.tileY;
      
      if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
        newX--; moved = true;
      } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
        newX++; moved = true;
      } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        newY--; moved = true;
      } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        newY++; moved = true;
      }
      
      if (moved) {
        if (newX >= 0 && newX < gameConfig.mapWidth && 
            newY >= 0 && newY < gameConfig.mapHeight) {
          console.log(`⌨️ Flecha: ${this.selectedAgent.name} se mueve a [${newX}, ${newY}]`);
          this.selectedAgent.moveTo(newX, newY);
        }
      }
    }
    
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
      }
    }
  }
}
