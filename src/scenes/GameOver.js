import { NERO } from '../constants/colors.js';

class GameOver extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameOver',
      active: false,
    });
  }

  create() {
    this.scene.setVisible(false, 'Interface');
    this.scene.setVisible(false, 'Pinup');

    const gameover = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 4,
        'Game Over!',
        { fontFamily: 'Akbar', fontSize: 144, color: NERO }
      )
      .setPadding(16)
      .setOrigin(0.5);

    const pressToPlay = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2.5,
        'Press any key to restart',
        { fontFamily: 'Akbar', fontSize: 32, color: NERO }
      )
      .setPadding(16)
      .setOrigin(0.5);


    this.input.manager.enabled = true;
    this.input.keyboard.on('keydown', this.restart, this);
  }

  restart() {

    this.scene.setVisible(true, 'Interface');
    this.scene.setVisible(true, 'Pinup');
    this.scene.start('Board');
  }

  update() {
  }
}

export default GameOver;
