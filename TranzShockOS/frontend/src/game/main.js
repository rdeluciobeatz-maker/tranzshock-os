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

  // 1. Crear configuración SIN escenas
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
    scene: [] // <--- EMPEZAMOS SIN ESCENAS
  };

  console.log("🛠 Creando juego...");
  const game = new Phaser.Game(config);

  // 2. Cuando el juego esté listo, agregamos la escena manualmente
  game.events.once('ready', () => {
    console.log("✅ Juego listo. Agregando escena 'MainScene'...");
    try {
      // Añadir la escena al administrador de escenas y ejecutarla
      game.scene.add('MainScene', MainScene, true);
      console.log("🎬 Escena 'MainScene' agregada y lanzada con éxito.");
    } catch (error) {
      console.error("❌ Error al agregar la escena:", error);
    }
  });

  // 3. Capturar cualquier error global de Phaser
  game.events.on('error', (error) => {
    console.error("❌ Error en Phaser:", error);
  });

  return game;
};
