import { gameConfig } from './config';

export class Agent {
  constructor(scene, id, x, y, color, name) {
    this.scene = scene;
    this.id = id;
    this.name = name;
    this.color = color;
    this.isSelected = false;
    
    this.tileX = x;
    this.tileY = y;
    
    this.x = x * gameConfig.tileSize + gameConfig.tileSize/2;
    this.y = y * gameConfig.tileSize + gameConfig.tileSize/2;
    
    this.targetX = this.x;
    this.targetY = this.y;
    this.isMoving = false;
    this.direction = 'down';
    
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
    
    this.idleTween = scene.tweens.add({
      targets: this.sprite,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }
  
  draw() {
    this.sprite.clear();
    
    // Color base (más brillante si está seleccionado)
    const brightness = this.isSelected ? 1.2 : 1;
    this.sprite.fillStyle(Phaser.Display.Color.ValueToColor(this.color).darken(-brightness).color, 1);
    
    // Cuerpo principal
    this.sprite.fillRect(this.x - 12, this.y - 12, 24, 24);
    
    // Ojos
    this.sprite.fillStyle(0xffffff, 1);
    this.sprite.fillRect(this.x - 6, this.y - 6, 4, 4);
    this.sprite.fillRect(this.x + 2, this.y - 6, 4, 4);
    
    // Borde (más grueso si está seleccionado)
    const borderWidth = this.isSelected ? 4 : 2;
    this.sprite.lineStyle(borderWidth, 0x7fff7f, 1);
    this.sprite.strokeRect(this.x - 12, this.y - 12, 24, 24);
    
    // Indicador de energía
    this.sprite.fillStyle(0x7fff7f, 1);
    this.sprite.fillRect(this.x + 10, this.y - 10, 4, 4);
  }
  
  setSelected(selected) {
    this.isSelected = selected;
    this.draw(); // Redibujar con nuevo estilo
  }
  
  moveTo(tileX, tileY) {
    if (tileX < 0 || tileX >= gameConfig.mapWidth || 
        tileY < 0 || tileY >= gameConfig.mapHeight) {
      console.log("🚫 Fuera de límites");
      return;
    }
    
    console.log(`🚶 ${this.name} moviéndose a [${tileX}, ${tileY}]`);
    
    if (tileX > this.tileX) this.direction = 'right';
    else if (tileX < this.tileX) this.direction = 'left';
    else if (tileY > this.tileY) this.direction = 'down';
    else if (tileY < this.tileY) this.direction = 'up';
    
    this.targetX = tileX * gameConfig.tileSize + gameConfig.tileSize/2;
    this.targetY = tileY * gameConfig.tileSize + gameConfig.tileSize/2;
    this.isMoving = true;
    this.draw();
  }
  
  update(delta) {
    if (this.isMoving) {
      const speed = 200 * delta;
      
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
        
        this.scene.tweens.add({
          targets: this.sprite,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
          yoyo: true
        });
      }
      
      this.sprite.setPosition(this.x, this.y);
      this.nameText.setPosition(this.x, this.y - 25);
    }
  }
}
