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
    // 👇 IMPORTANTE: Array de escenas vacío
    scene: []
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

  // 2. Esperar un ciclo para asegurar que el juego está listo
  setTimeout(() => {
    console.log("⏰ [initGame] setTimeout: Intentando agregar escena...");
    
    // 3. Verificar que el Scene Manager existe
    if (game.scene) {
      console.log("✅ [initGame] Scene Manager encontrado.");
      
      // 4. Verificar si la escena ya existe (por si acaso)
      if (!game.scene.get('MainScene')) {
        console.log("➕ [initGame] Añadiendo escena 'MainScene' al Scene Manager...");
        
        // 5. Añadir la escena (primer parámetro: clave, segundo: clase, tercero: auto-start)
        const sceneKey = game.scene.add('MainScene', MainScene, false);
        console.log(`🔑 [initGame] Escena añadida con clave: '${sceneKey}'`);
        
        // 6. Iniciar la escena explícitamente
        console.log("🚀 [initGame] Iniciando escena 'MainScene'...");
        game.scene.start('MainScene');
        console.log("✅ [initGame] Escena 'MainScene' iniciada.");
      } else {
        console.log("⚠️ [initGame] La escena 'MainScene' ya existía. Intentando reiniciar.");
        game.scene.start('MainScene');
      }
    } else {
      console.error("❌ [initGame] Error: game.scene no está disponible.");
    }
  }, 200); // Pequeño retraso para dar tiempo al motor a inicializarse

  // 7. Capturar errores globales de Phaser
  game.events.on('error', (error) => {
    console.error("❌ [Phaser Global Error]", error);
  });

  return game;
};
