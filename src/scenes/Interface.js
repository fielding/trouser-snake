class Interface extends Phaser.Scene {
  constructor() {
    super({
      key: 'Interface',
      active: false,
    });

    this.isPaused = false;
  }

  create() {
    this.scene.launch('Pinup');
    this.scene.launch('Board');

    this.input.manager.enabled = true;

    this.input.keyboard.on('keydown_P', this.togglePause, this);
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
}

export default Interface;
