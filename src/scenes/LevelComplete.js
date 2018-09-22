import { NERO } from '../constants/colors.js';

class LevelComplete extends Phaser.Scene {
  constructor() {
    super({
      key: 'LevelComplete',
      active: false,
    });
  }

  create() {
    this.registry.values.level += 1;
    this.scene.setVisible(false, 'Interface');
    const { width, height } = this.sys.game.config;
    const scale = Math.min(width / 3840, height / 2160);

    this.complete = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 4,
        'Level Complete!',
        { fontFamily: 'Akbar', fontSize: 389 * scale, color: NERO }
      )
      .setPadding(16)
      .setOrigin(0.5);

    this.pressToPlay = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2.5,
        'Press enter key to continue',
        { fontFamily: 'Akbar', fontSize: 86 * scale, color: NERO }
      )
      .setPadding(16)
      .setOrigin(0.5);


    this.input.manager.enabled = true;
    this.input.keyboard.on('keydown', this.continue, this);
    this.events.on('resize', this.resize, this);
  }

  continue() {
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

    this.complete.setFontSize(389 * scale);
    this.complete.setX(width / 2);
    this.complete.setY(height / 4);

    this.pressToPlay.setFontSize(86 * scale);
    this.pressToPlay.setX(width / 2);
    this.pressToPlay.setY(height / 2.5);
  }
}

export default LevelComplete;
