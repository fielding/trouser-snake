import 'phaser';
import CloudScene from './scenes/CloudScene';
import BoardScene from './scenes/BoardScene';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x92d4f7,
  scaleMode: 0, // Phaser.ScaleManager.EXACT_FIT,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [CloudScene, BoardScene],
};

const game = new Phaser.Game(config);
