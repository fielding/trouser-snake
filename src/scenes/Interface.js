import { NERO } from '../constants/colors.js';

class Interface extends Phaser.Scene {
  constructor() {
    super({
      key: 'Interface',
      active: false,
    });

    this.isPaused = false;
  }

  create() {

    const pinup = this.scene.get('Pinup');
    const board = this.scene.get('Board');

    this.scene
      .launch(pinup)
      .launch(board)
      .bringToTop();

    const { width, height } = this.sys.game.config;

    const actualScale = Math.min(
      width / 3840,
      height / 2160
    );

    this.score = this.add
      .text(
        // this.sys.game.config.width / 3,
        ((this.sys.game.config.width - 1000) / 3) * 2 + 750,
        (this.sys.game.config.height - 500) / 4,
        'score: 0',
        {
          fontFamily: 'Akbar',
          fontSize: 144 * scale,
          color: NERO,
        }
      )
      .setOrigin(0.5);
    this.interface = this.add
      .image(0, 0, 'interface')
      .setScale(scale)
      .setOrigin(0);

    this.interface
      .setPosition((width - this.interface.width * scale) / 2, (height - this.interface.height * scale) / 2);

    this.registry.set('ui', {x: this.interface.x, y: this.interface.y, width: this.interface.width, height: this.interface.height});

    this.level = this.add
      .text(
        // this.sys.game.config.width / 3,
        (this.sys.game.config.width - 1000) / 3 + 250,
        (this.sys.game.config.height - 500) / 4,
        'level: 1',
        {
          fontFamily: 'Akbar',
          fontSize: 144 * scale,
          color: NERO,
        }
      )
      .setOrigin(0.5);

    this.input.manager.enabled = true;
    this.input.keyboard.on('keydown_P', this.togglePause, this);
    this.input.keyboard.on('keydown_ESC', this.togglePause, this); // change this to toggleMenu

    this.registry.events.on('changedata', this.updateData, this);

  }

  pause() {
    this.scene.pause('Board');
    this.isPaused = true;
    console.debug('pause');
  }

  unpause() {
    this.scene.resume('Board');
    this.isPaused = false;
    console.debug('unpause');
  }

  togglePause() {
    if(this.isPaused) {
      this.unpause()
    } else {
      this.pause()
    }
  }

  setScoreDisplay(score) {
    this.score.setText(`score: ${score}`);
  }

  setLevelDisplay(level) {
    this.level.setText(`level: ${level}`);
  }

  updateData() {
    this.setScoreDisplay(this.registry.values.score);
    this.setLevelDisplay(this.registry.values.level);
  }
}

export default Interface;
