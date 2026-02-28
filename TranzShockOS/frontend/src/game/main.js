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
