import 'phaser';
import Boot from './scenes/Boot';
import Clouds from './scenes/Clouds';
import Title from './scenes/Title';
import Interface from './scenes/Interface';
import Board from './scenes/Board';
import GameOver from './scenes/GameOver';
import LevelComplete from './scenes/LevelComplete';
import Pause from './scenes/Pause';
import Pinup from './scenes/Pinup';
import { GREY_SUIT } from './constants/colors';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  loader: {
    crossOrigin: true,
  },
  backgroundColor: GREY_SUIT,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [Boot, Clouds, Title, Interface, Board, Pinup, GameOver, LevelComplete, Pause],
};

const game = new Phaser.Game(config);

window.addEventListener('resize', event => {
  game.resize(window.innerWidth, window.innerHeight);
}, false);
