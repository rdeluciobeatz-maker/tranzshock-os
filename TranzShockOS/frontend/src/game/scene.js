import Phaser from 'phaser';
import { gameConfig } from './config';

export class MainScene extends Phaser.Scene {
  constructor() {
    // La clave de la escena debe coincidir con la que usamos en main.js
    super({ key: 'MainScene' });
    console.log("🏗️ [MainScene] CONSTRUCTOR EJECUTADO");
  }

  init() {
    console.log("📋 [MainScene] init() EJECUTADO");
  }

  preload() {
    console.log("📦 [MainScene] preload() EJECUTADO");
  }

  create() {
    console.log("✨ [MainScene] create() EJECUTADO - ESCENA ACTIVA");

    // Fondo verde sólido
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x1a3a1a).setOrigin(0);

    // Texto grande de confirmación
    const texto = this.add.text(this.scale.width/2, this.scale.height/2, '✅ MAPA ACTIVO', {
      fontFamily: 'Share Tech Mono',
      fontSize: '48px',
      color: '#7fff7f',
      stroke: '#0f3f0f',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5);

    // Animación simple para ver que la escena se actualiza
    this.tweens.add({
      targets: texto,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Dibujar un recuadro para dar contexto
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0x3f9f3f, 1);
    graphics.strokeRect(50, 50, this.scale.width-100, this.scale.height-100);

    console.log("✅ [MainScene] create() completado. Elementos visuales añadidos.");
  }

  update() {
    // Podemos poner un log muy espaciado para verificar que update corre
    // if (Math.random() < 0.01) console.log("🔄 [MainScene] update()");
  }
}
