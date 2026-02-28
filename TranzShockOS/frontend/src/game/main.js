import Phaser from 'phaser';
import { MainScene } from './scene';
import { gameConfig } from './config';

export const initGame = (parentElement) => {
  const config = {
    type: Phaser.AUTO,
    width: gameConfig.width,
    height: gameConfig.height,
    parent: parentElement,
    scene: [MainScene],
    backgroundColor: '#0f130f',
    pixelArt: true
  };
  
  return new Phaser.Game(config);
};
// Después de new Phaser.Game(config)
game.events.on('ready', () => {
  console.log("🎮 Juego listo, dimensiones:", game.scale.width, game.scale.height);
});
