import Phaser from 'phaser';
import { MainScene } from './scene';
import { gameConfig } from './config';

export const initGame = (parentElement) => {
  console.log("🎮 [initGame] Función llamada");
  console.log("📌 [initGame] Parent element:", parentElement);

  if (!parentElement) {
    console.error("❌ [initGame] Error: parentElement es null");
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
    scene: []
  };

  console.log("🛠 [initGame] Creando instancia de Phaser.Game...");
  let game;
  try {
    game = new Phaser.Game(config);
    console.log("✅ [initGame] Instancia de Phaser.Game creada.");
    
    // 👇 NUEVO: Forzar visibilidad del canvas
    setTimeout(() => {
      const canvas = parentElement.querySelector('canvas');
      if (canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.visibility = 'visible';
        canvas.style.backgroundColor = '#ff0000'; // Rojo temporal
        console.log('🎨 Canvas forzado visible');
      } else {
        console.log('❌ Canvas no encontrado - creando respaldo');
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = gameConfig.width;
        fallbackCanvas.height = gameConfig.height;
        fallbackCanvas.style.width = '100%';
        fallbackCanvas.style.height = '100%';
        fallbackCanvas.style.backgroundColor = '#00ff00';
        fallbackCanvas.style.display = 'block';
        parentElement.appendChild(fallbackCanvas);
        console.log('🟢 Canvas de respaldo creado');
      }
    }, 1000);
    
    window.__TRANZSHOCK_GAME__ = game;
    
  } catch (error) {
    console.error("❌ [initGame] Error al crear Phaser.Game:", error);
    return null;
  }

  game.events.once('ready', () => {
    console.log("✅ [initGame] Evento 'ready' recibido.");
    
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
