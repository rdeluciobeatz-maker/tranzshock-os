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

  // 1. Crear configuración base (SIN ESCENAS EN EL ARRAY)
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
  } catch (error) {
    console.error("❌ [initGame] Error al crear Phaser.Game:", error);
    return null;
  }

  // 2. Esperar a que el juego esté listo (evento 'ready')
  game.events.once('ready', () => {
    console.log("✅ [initGame] Evento 'ready' recibido. Scene Manager disponible.");
    
    // 3. Ahora sí podemos agregar la escena de forma segura
    try {
      // Verificar si la escena ya existe de forma compatible con Phaser
      const sceneExists = game.scene.getIndex('MainScene') !== -1;
      
      if (!sceneExists) {
        console.log("➕ [initGame] Añadiendo escena 'MainScene'...");
        game.scene.add('MainScene', MainScene, true); // true = auto-start
        console.log("✅ [initGame] Escena 'MainScene' añadida e iniciada.");
      } else {
        console.log("⚠️ [initGame] La escena ya existe. Iniciando...");
        game.scene.start('MainScene');
      }
    } catch (error) {
      console.error("❌ [initGame] Error al manejar la escena:", error);
    }
  });

  // 4. Capturar errores globales de Phaser
  game.events.on('error', (error) => {
    console.error("❌ [Phaser Global Error]", error);
  });

  return game;
};
