import 'phaser';
import Boot from './scenes/Boot';
import Clouds from './scenes/Clouds';
import Title from './scenes/Title';
import Interface from './scenes/Interface';
import BoardScene from './scenes/BoardScene';
import GameOver from './scenes/GameOver';
import LevelComplete from './scenes/LevelComplete';
import Pinup from './scenes/Pinup';
import CONST from './constants';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  loader: {
    baseURL: '../',
    path: 'assets/img/',
    crossOrigin: true,
  },
  backgroundColor: CONST.colors.greySuit,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [Boot, Clouds, Title, Interface, BoardScene, Pinup, GameOver, LevelComplete],
};

const game = new Phaser.Game(config);

window.addEventListener('resize', event => {
  game.resize(window.innerWidth, window.innerHeight);
}, false);
