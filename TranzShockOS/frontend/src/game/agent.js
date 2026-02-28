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
    
    this.phrases = {
      'MANAGER': ["📊 Revisando KPIs", "✅ Todo en orden", "📈 Ventas +15%", "👥 Reunión a las 3", "🎯 Objetivos cumplidos"],
      'ANALYST': ["🔍 Diagnosticando...", "⚡ Falla en conector", "📱 iPhone listo", "🔧 Reparando placa", "📊 Análisis completo"],
      'DESIGNER': ["🎨 Diseñando UI", "✨ Prototipo listo", "📱 App en desarrollo", "🖌️ Nuevo concepto", "✅ Cliente aprobó"],
      'PROGRAMMER': ["💻 Compilando...", "🐛 Debuggeando", "🚀 Deploy exitoso", "📦 API conectada", "⚡ Optimizando código"]
    };
    
    // SPRITE PRINCIPAL
    this.sprite = scene.add.graphics();
    this.draw();
    
    // NOMBRE (MÁS CERCA)
    this.nameText = scene.add.text(this.x, this.y - 12, name, {
      fontFamily: 'Share Tech Mono',
      fontSize: '9px',
      color: '#b0ffb0',
      backgroundColor: '#0f1f0f',
      padding: { x: 2, y: 1 },
      resolution: 2
    }).setOrigin(0.5);
    
    // BURBUJA (DESACTIVADA TEMPORALMENTE)
    // this.bubble = scene.add.graphics();
    // this.bubbleText = scene.add.text(0, 0, '', { ... }).setVisible(false);
    
    this.idleTween = null;
    this.startIdleAnimation();
  }
  
  startIdleAnimation() {
    if (this.idleTween) this.idleTween.stop();
    this.idleTween = this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  draw() {
    this.sprite.clear();
    
    let fillColor = this.color;
    if (this.isSelected) fillColor = 0x9fff9f;
    
    // CUERPO
    this.sprite.fillStyle(fillColor, 1);
    this.sprite.fillRect(this.x - 8, this.y - 8, 16, 16);
    
    // OJOS
    this.sprite.fillStyle(0xffffff, 1);
    this.sprite.fillRect(this.x - 5, this.y - 5, 3, 3);
    this.sprite.fillRect(this.x + 2, this.y - 5, 3, 3);
    
    // BORDE
    const borderWidth = this.isSelected ? 3 : 1;
    this.sprite.lineStyle(borderWidth, 0x7fff7f, 1);
    this.sprite.strokeRect(this.x - 8, this.y - 8, 16, 16);
  }
  
  setSelected(selected) {
    this.isSelected = selected;
    this.draw();
    this.startIdleAnimation();
    if (selected) console.log(`✅ ${this.name} seleccionado`);
  }
  
  speak(message) {
    console.log(`💬 ${this.name}: ${message || '...'}`);
  }
  
  moveTo(tileX, tileY) {
    if (tileX < 0 || tileX >= gameConfig.mapWidth || tileY < 0 || tileY >= gameConfig.mapHeight) {
      return false;
    }
    
    const moveMessages = ["🚶 Voy", "🔄 En camino", "📍 A la orden", "⚡ Moviendo"];
    this.speak(moveMessages[Math.floor(Math.random() * moveMessages.length)]);
    
    if (tileX > this.tileX) this.direction = 'right';
    else if (tileX < this.tileX) this.direction = 'left';
    else if (tileY > this.tileY) this.direction = 'down';
    else if (tileY < this.tileY) this.direction = 'up';
    
    this.targetX = tileX * gameConfig.tileSize + gameConfig.tileSize/2;
    this.targetY = tileY * gameConfig.tileSize + gameConfig.tileSize/2;
    this.isMoving = true;
    this.draw();
    
    return true;
  }
  
  update(delta) {
    let positionChanged = false;
    
    // --- MOVIMIENTO FÍSICO ---
    if (this.isMoving) {
      const speed = 2.5; // Velocidad constante para animación visible
      
      if (Math.abs(this.x - this.targetX) > 0.5) {
        this.x += (this.x < this.targetX ? speed : -speed);
        positionChanged = true;
      } else {
        this.x = this.targetX;
      }
      
      if (Math.abs(this.y - this.targetY) > 0.5) {
        this.y += (this.y < this.targetY ? speed : -speed);
        positionChanged = true;
      } else {
        this.y = this.targetY;
      }
      
      // Verificar si llegó al destino
      if (Math.abs(this.x - this.targetX) <= 0.5 && Math.abs(this.y - this.targetY) <= 0.5) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.isMoving = false;
        this.tileX = Math.floor(this.x / gameConfig.tileSize);
        this.tileY = Math.floor(this.y / gameConfig.tileSize);
        
        const arrivalMessages = ["✅ Llegué", "🎯 Listo", "📍 Aquí", "👍 OK"];
        this.speak(arrivalMessages[Math.floor(Math.random() * arrivalMessages.length)]);
        
        this.scene.tweens.add({
          targets: this.sprite,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 100,
          yoyo: true
        });
      }
    }
    
    // --- ACTUALIZACIÓN OBLIGATORIA (SIEMPRE) ---
    this.sprite.setPosition(this.x, this.y);
    this.nameText.setPosition(this.x, this.y - 12);
    
    // Redibujar si cambió posición o si está seleccionado (para mantener borde)
    if (positionChanged || this.isSelected) {
      this.draw();
    }
  }
}
