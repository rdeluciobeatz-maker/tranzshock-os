import Phaser from 'phaser';
import { MainScene } from './scene';
import { gameConfig } from './config';

export const initGame = (parentElement) => {
  console.log("🎮 initGame llamado");
  console.log("📌 parentElement:", parentElement);

  if (!parentElement) {
    console.error("❌ Error: parentElement es null");
    return null;
  }

  // Crear configuración
  const config = {
    type: Phaser.AUTO,
    width: gameConfig.width,
    height: gameConfig.height,
    parent: parentElement,
    backgroundColor: '#0f130f',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    audio: {
      disableWebAudio: true
    },
    scene: [] // Empezamos sin escenas
  };

  console.log("🛠 Creando juego...");
  const game = new Phaser.Game(config);
  
  // Registrar evento cuando el juego esté listo
  game.events.once('ready', () => {
    console.log("✅ Juego listo, agregando escena...");
    
    // Agregar la escena manualmente
    game.scene.add('MainScene', MainScene, true);
    
    console.log("🎬 Escena 'MainScene' agregada y lanzada");
  });

  // Verificar errores
  game.events.on('error', (error) => {
    console.error("❌ Error en Phaser:", error);
  });

  return game;
};
