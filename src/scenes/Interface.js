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
      .launch(board);

    const scale = Math.min(
      this.sys.game.config.width / 3840,
      this.sys.game.config.height / 2160
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

  toggleMenu() {
    // menu code
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
