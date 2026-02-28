import Phaser from 'phaser';
import { MainScene } from './scene';
import { gameConfig } from './config';

export const initGame = (parentElement) => {
  console.log("🎮 initGame llamado");
  console.log("📌 parentElement:", parentElement);
  console.log("📐 Config:", gameConfig);

  if (!parentElement) {
    console.error("❌ Error: parentElement es null o undefined");
    return null;
  }

  const config = {
    type: Phaser.AUTO,
    width: gameConfig.width,
    height: gameConfig.height,
    parent: parentElement,
    scene: [MainScene],
    backgroundColor: '#0f130f',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    audio: {
      disableWebAudio: true // Desactiva audio para evitar warning
    }
  };

  try {
    console.log("🛠 Creando nuevo juego Phaser...");
    const game = new Phaser.Game(config);
    console.log("✅ Juego Phaser creado exitosamente");
    return game;
  } catch (error) {
    console.error("❌ Error al crear Phaser.Game:", error);
    return null;
  }
};
