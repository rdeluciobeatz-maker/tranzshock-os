import Phaser from 'phaser';
import { gameConfig } from './config';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    console.log("🏗️ CONSTRUCTOR DE MainScene EJECUTADO");
  }

  init() {
    console.log("📋 init() de MainScene ejecutado");
  }

  preload() {
    console.log("📦 preload() de MainScene ejecutado");
  }

  create() {
    console.log("✨ create() de MainScene EJECUTADO - ESCENA ACTIVA");
    
    // Fondo verde
    this.add.rectangle(0, 0, gameConfig.width, gameConfig.height, 0x1a3a1a).setOrigin(0);
    
    // Texto grande para confirmar que funciona
    const text = this.add.text(400, 300, '✅ MAPA ACTIVO', {
      fontFamily: 'Share Tech Mono',
      fontSize: '32px',
      color: '#7fff7f'
    }).setOrigin(0.5);
    
    // Animación del texto
    this.tweens.add({
      targets: text,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
    
    console.log("✅ create() completado - Elementos añadidos");
  }

  update() {
    // Por ahora vacío
  }
}
