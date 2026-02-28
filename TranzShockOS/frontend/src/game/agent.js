import { gameConfig } from './config';

export class Agent {
  constructor(scene, id, x, y, color, name) {
    this.scene = scene;
    this.id = id;
    this.name = name;
    this.color = color;
    
    this.tileX = x;
    this.tileY = y;
    
    this.x = x * gameConfig.tileSize + gameConfig.tileSize/2;
    this.y = y * gameConfig.tileSize + gameConfig.tileSize/2;
    
    this.targetX = this.x;
    this.targetY = this.y;
    this.isMoving = false;
    
    this.sprite = scene.add.graphics();
    this.draw();
    
    this.nameText = scene.add.text(this.x, this.y - 25, name, {
      fontFamily: 'Share Tech Mono',
      fontSize: '12px',
      color: '#b0ffb0',
      backgroundColor: '#0f1f0f',
      padding: { x: 4, y: 2 },
      resolution: 2
    }).setOrigin(0.5);
  }
  
  draw() {
    this.sprite.clear();
    
    // Cuerpo
    this.sprite.fillStyle(this.color, 1);
    this.sprite.fillRect(this.x - 12, this.y - 12, 24, 24);
    
    // Ojos
    this.sprite.fillStyle(0xffffff, 1);
    this.sprite.fillRect(this.x - 6, this.y - 6, 4, 4);
    this.sprite.fillRect(this.x + 2, this.y - 6, 4, 4);
    
    // Borde
    this.sprite.lineStyle(2, 0x7fff7f, 1);
    this.sprite.strokeRect(this.x - 12, this.y - 12, 24, 24);
  }
  
  moveTo(tileX, tileY) {
    console.log(`🚶 ${this.name} moviéndose a [${tileX}, ${tileY}]`);
    this.targetX = tileX * gameConfig.tileSize + gameConfig.tileSize/2;
    this.targetY = tileY * gameConfig.tileSize + gameConfig.tileSize/2;
    this.isMoving = true;
  }
  
  update(delta) {
    if (this.isMoving) {
      const speed = 150 * delta;
      
      if (Math.abs(this.x - this.targetX) > 1) {
        this.x += (this.x < this.targetX ? speed : -speed);
      }
      
      if (Math.abs(this.y - this.targetY) > 1) {
        this.y += (this.y < this.targetY ? speed : -speed);
      }
      
      if (Math.abs(this.x - this.targetX) <= 1 && Math.abs(this.y - this.targetY) <= 1) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.isMoving = false;
        this.tileX = Math.floor(this.x / gameConfig.tileSize);
        this.tileY = Math.floor(this.y / gameConfig.tileSize);
        console.log(`✅ ${this.name} llegó a [${this.tileX}, ${this.tileY}]`);
      }
      
      this.sprite.setPosition(this.x, this.y);
      this.nameText.setPosition(this.x, this.y - 25);
    }
  }
}
