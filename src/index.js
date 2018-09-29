import 'phaser';
import { SceneWatcherPlugin } from 'phaser-plugin-scene-watcher';
import Boot from './scenes/Boot';
import Clouds from './scenes/Clouds';
import Intro from './scenes/Intro';
import Interface from './scenes/Interface';
import Board from './scenes/Board';
import GameOver from './scenes/GameOver';
import LevelComplete from './scenes/LevelComplete';
import Pause from './scenes/Pause';
import MainMenu from './scenes/MainMenu';
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
  plugins: {
    global: [
      {
        key: 'SceneWatcherPlugin',
        plugin: Phaser.Plugins.SceneWatcherPlugin,
        start: true,
      },
    ],
  },
  // callbacks: {
  //   postBoot: function (game) {
  //     game.plugins.get('SceneWatcherPlugin').watchAll();
  //   }
  // },
  scene: [Boot, Clouds, Intro, Interface, Board, Pinup, GameOver, LevelComplete, Pause, MainMenu],
};

const game = new Phaser.Game(config);

window.addEventListener('resize', event => {
  game.resize(window.innerWidth, window.innerHeight);
}, false);
