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
    
    // Frases posibles para cada tipo de agente
    this.phrases = {
      'MANAGER': [
        "📊 Revisando KPIs",
        "✅ Todo en orden",
        "📈 Ventas +15%",
        "👥 Reunión a las 3",
        "🎯 Objetivos cumplidos"
      ],
      'ANALYST': [
        "🔍 Diagnosticando...",
        "⚡ Falla en conector",
        "📱 iPhone listo",
        "🔧 Reparando placa",
        "📊 Análisis completo"
      ],
      'DESIGNER': [
        "🎨 Diseñando UI",
        "✨ Prototipo listo",
        "📱 App en desarrollo",
        "🖌️ Nuevo concepto",
        "✅ Cliente aprobó"
      ],
      'PROGRAMMER': [
        "💻 Compilando...",
        "🐛 Debuggeando",
        "🚀 Deploy exitoso",
        "📦 API conectada",
        "⚡ Optimizando código"
      ]
    };
    
    // Sprite principal
    this.sprite = scene.add.graphics();
    this.draw();
    
    // Nombre
    this.nameText = scene.add.text(this.x, this.y - 18, name, {
      fontFamily: 'Share Tech Mono',
      fontSize: '11px',
      color: '#b0ffb0',
      backgroundColor: '#0f1f0f',
      padding: { x: 3, y: 1 },
      resolution: 2
    }).setOrigin(0.5);
    
    // Burbuja de texto (invisible al inicio)
    this.bubble = scene.add.graphics();
    this.bubbleText = scene.add.text(0, 0, '', {
      fontFamily: 'Share Tech Mono',
      fontSize: '10px',
      color: '#000000',
      backgroundColor: '#7fff7f',
      padding: { x: 4, y: 2 },
      resolution: 2,
      wordWrap: { width: 120 }
    }).setOrigin(0.5).setVisible(false);
    
    this.bubble.setVisible(false);
    
    // Animación idle
    this.idleTween = null;
    this.startIdleAnimation();
  }
  
  startIdleAnimation() {
    if (this.idleTween) {
      this.idleTween.stop();
    }
    
    this.idleTween = this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.9,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  draw() {
    this.sprite.clear();
    
    let fillColor = this.color;
    if (this.isSelected) {
      fillColor = 0x9fff9f;
    }
    
    this.sprite.fillStyle(fillColor, 1);
    this.sprite.fillRect(this.x - 10, this.y - 10, 20, 20);
    
    this.sprite.fillStyle(0xffffff, 1);
    
    if (this.direction === 'down' || this.direction === 'up') {
      this.sprite.fillRect(this.x - 5, this.y - 5, 3, 3);
      this.sprite.fillRect(this.x + 2, this.y - 5, 3, 3);
    } else {
      this.sprite.fillRect(this.x - 2, this.y - 5, 3, 3);
      this.sprite.fillRect(this.x - 2, this.y + 2, 3, 3);
    }
    
    const borderWidth = this.isSelected ? 3 : 1;
    this.sprite.lineStyle(borderWidth, 0x7fff7f, 1);
    this.sprite.strokeRect(this.x - 10, this.y - 10, 20, 20);
    
    if (this.isSelected) {
      this.sprite.fillStyle(0x7fff7f, 1);
      this.sprite.fillRect(this.x + 8, this.y - 8, 3, 3);
    }
  }
  
  setSelected(selected) {
    this.isSelected = selected;
    this.draw();
    this.startIdleAnimation();
    
    if (selected) {
      this.speak("✅ ¡Listo para trabajar!");
    }
  }
  
  // NUEVO: Método para hablar
  speak(message) {
    // Si no hay mensaje, elegir uno aleatorio de las frases del agente
    if (!message) {
      const agentPhrases = this.phrases[this.name] || this.phrases['MANAGER'];
      const randomIndex = Math.floor(Math.random() * agentPhrases.length);
      message = agentPhrases[randomIndex];
    }
    
    // Posición de la burbuja (encima del agente)
    const bubbleX = this.x;
    const bubbleY = this.y - 40;
    
    // Actualizar texto
    this.bubbleText.setText(message);
    this.bubbleText.setPosition(bubbleX, bubbleY);
    this.bubbleText.setVisible(true);
    
    // Dibujar burbuja (fondo blanco/verde)
    this.bubble.clear();
    this.bubble.fillStyle(0x7fff7f, 1);
    
    // Calcular tamaño según texto
    const textWidth = this.bubbleText.width + 20;
    const textHeight = this.bubbleText.height + 10;
    
    // Dibujar rectángulo redondeado
    this.bubble.fillRoundedRect(
      bubbleX - textWidth/2,
      bubbleY - textHeight/2,
      textWidth,
      textHeight,
      5
    );
    
    // Borde más oscuro
    this.bubble.lineStyle(2, 0x3f9f3f, 1);
    this.bubble.strokeRoundedRect(
      bubbleX - textWidth/2,
      bubbleY - textHeight/2,
      textWidth,
      textHeight,
      5
    );
    
    this.bubble.setVisible(true);
    
    // Ocultar después de 3 segundos
    this.scene.time.delayedCall(3000, () => {
      this.bubble.setVisible(false);
      this.bubbleText.setVisible(false);
    });
  }
  
  moveTo(tileX, tileY) {
    if (tileX < 0 || tileX >= gameConfig.mapWidth || 
        tileY < 0 || tileY >= gameConfig.mapHeight) {
      return false;
    }
    
    // Hablar al moverse
    const moveMessages = [
      "🚶 Voy para allá",
      "🔄 En camino",
      "📍 Objetivo: " + tileX + "," + tileY,
      "⚡ Moviéndome",
      "➡️ A la orden"
    ];
    const randomMsg = moveMessages[Math.floor(Math.random() * moveMessages.length)];
    this.speak(randomMsg);
    
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
        
        // Hablar al llegar
        const arrivalMessages = [
          "✅ Llegué",
          "🎯 Misión cumplida",
          "📍 Aquí estoy",
          "👍 Listo",
          "💪 Tarea completada"
        ];
        const randomMsg = arrivalMessages[Math.floor(Math.random() * arrivalMessages.length)];
        this.speak(randomMsg);
        
        this.scene.tweens.add({
          targets: this.sprite,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 150,
          yoyo: true,
          onComplete: () => {
            this.sprite.setScale(1);
          }
        });
      }
      
      this.sprite.setPosition(this.x, this.y);
      this.nameText.setPosition(this.x, this.y - 18);
      
      // Mover burbuja si está visible
      if (this.bubble.visible) {
        this.bubble.setPosition(this.x, this.y - 40);
        this.bubbleText.setPosition(this.x, this.y - 40);
      }
    }
  }
}
