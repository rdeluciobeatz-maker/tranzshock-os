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
    console.log("📦 preload() de MainScene ejecutado (sin assets)");
  }

  create() {
    console.log("✨ create() de MainScene EJECUTADO - ESCENA ACTIVA");

    // Fondo verde oscuro
    this.add.rectangle(0, 0, gameConfig.width, gameConfig.height, 0x1a3a1a).setOrigin(0);

    // Texto grande de confirmación
    const texto = this.add.text(400, 300, '✅ MAPA ACTIVO', {
      fontFamily: 'Share Tech Mono',
      fontSize: '48px',
      color: '#7fff7f',
      stroke: '#0f3f0f',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Hacemos que el texto parpadee para ver que la escena se actualiza
    this.tweens.add({
      targets: texto,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Dibujar un grid simple para referencia
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x3a6f3a, 0.8);
    graphics.strokeRect(50, 50, 700, 500);

    console.log("✅ create() completado - Elementos visuales añadidos.");
  }

  update() {
    // Vacío por ahora, pero podemos poner un log ocasional
    // console.log("🔄 update() en ejecución");
  }
}
