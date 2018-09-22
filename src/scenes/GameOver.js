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

    const { width, height } = this.sys.game.config;
    const scale = Math.min(width / 3840, height / 2160);

    this.gameover = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 4,
        'Game Over!',
        { fontFamily: 'Akbar', fontSize: 389 * scale, color: NERO }
      )
      .setPadding(16)
      .setOrigin(0.5);

    this.pressToPlay = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2.5,
        'Press any key to restart',
        { fontFamily: 'Akbar', fontSize: 86 * scale, color: NERO }
      )
      .setPadding(16)
      .setOrigin(0.5);


    this.input.manager.enabled = true;
    this.input.keyboard.on('keydown', this.restart, this);
    this.events.on('resize', this.resize, this);
  }

  restart() {
    this.scene.setVisible(true, 'Interface');
    this.scene.start('Pinup');
    this.scene.launch('Board');
  }

  resize(
    width = this.sys.game.config.width,
    height = this.sys.game.config.height
  ) {
    this.cameras.resize(width, height);

    const scale = Math.min(width / 3840, height / 2160);

    this.gameover.setFontSize(389 * scale);
    this.gameover.setX(width / 2);
    this.gameover.setY(height / 4);

    this.pressToPlay.setFontSize(86 * scale);
    this.pressToPlay.setX(width / 2);
    this.pressToPlay.setY(height / 2.5);
  }
}

export default GameOver;
