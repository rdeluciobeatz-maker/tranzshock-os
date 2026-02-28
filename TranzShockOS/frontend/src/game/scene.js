import Phaser from 'phaser';
import { gameConfig } from './config';
import { Agent } from './agent';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.agents = [];
    this.cursors = null;
  }
  
  create() {
    this.drawGrid();
    
    this.createAgent('agent1', 5, 5, gameConfig.colors.agent1, 'MANAGER');
    this.createAgent('agent2', 10, 8, gameConfig.colors.agent2, 'ANALYST');
    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.input.on('pointerdown', (pointer) => {
      const tileX = Math.floor(pointer.x / gameConfig.tileSize);
      const tileY = Math.floor(pointer.y / gameConfig.tileSize);
      
      if (this.agents.length > 0) {
        this.agents[0].moveTo(tileX, tileY);
      }
    });
  }
  
  drawGrid() {
    this.add.rectangle(0, 0, 
      gameConfig.width, gameConfig.height, 
      gameConfig.colors.floor
    ).setOrigin(0);
    
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x3a5f3a, 0.5);
    
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
  
  createAgent(id, x, y, color, name) {
    const agent = new Agent(this, id, x, y, color, name);
    this.agents.push(agent);
    return agent;
  }
  
  update(time, delta) {
    this.agents.forEach(agent => agent.update(delta / 1000));
    
    if (this.cursors && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      if (this.agents.length > 0) {
        const randomX = Math.floor(Math.random() * gameConfig.mapWidth);
        const randomY = Math.floor(Math.random() * gameConfig.mapHeight);
        this.agents[0].moveTo(randomX, randomY);
      }
    }
  }
}
