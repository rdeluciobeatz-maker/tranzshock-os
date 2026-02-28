import Phaser from 'phaser';
import { MainScene } from './scene';
import { gameConfig } from './config';

export const initGame = (parentElement) => {
  console.log("🎮 [initGame] Función llamada");
  console.log("📌 [initGame] Parent element:", parentElement);

  if (!parentElement) {
    console.error("❌ [initGame] Error: parentElement es null o undefined");
    return null;
  }

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
    scene: [] // Array vacío
  };

  console.log("🛠 [initGame] Creando instancia de Phaser.Game...");
  let game;
  try {
    game = new Phaser.Game(config);
    console.log("✅ [initGame] Instancia de Phaser.Game creada.");
    
    // 👇 HACER EL JUEGO GLOBAL (para diagnóstico)
    window.__TRANZSHOCK_GAME__ = game;
    console.log("🎮 Juego guardado globalmente como __TRANZSHOCK_GAME__");
    
  } catch (error) {
    console.error("❌ [initGame] Error al crear Phaser.Game:", error);
    return null;
  }

  game.events.once('ready', () => {
    console.log("✅ [initGame] Evento 'ready' recibido. Scene Manager disponible.");
    
    try {
      const sceneExists = game.scene.getIndex('MainScene') !== -1;
      
      if (!sceneExists) {
        console.log("➕ [initGame] Añadiendo escena 'MainScene'...");
        game.scene.add('MainScene', MainScene, true);
        console.log("✅ [initGame] Escena 'MainScene' añadida e iniciada.");
      } else {
        console.log("⚠️ [initGame] La escena ya existe. Iniciando...");
        game.scene.start('MainScene');
      }
    } catch (error) {
      console.error("❌ [initGame] Error al manejar la escena:", error);
    }
  });

  game.events.on('error', (error) => {
    console.error("❌ [Phaser Global Error]", error);
  });

  return game;
};
