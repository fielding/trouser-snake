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
    this.scene.launch('BoardScene');

    this.input.manager.enabled = true;

    this.input.keyboard.on('keydown_P', this.togglePause, this);

    // this.input.keyboard.on('keydown_A', event => {
    //   this.scene.setActive(true, 'CloudScene1');
    //   this.scene.setVisible(true, 'CloudScene1');
    // });
    //
    //
    // this.input.keyboard.on('keydown_B', event => {
    //   this.scene.setActive(true, 'CloudScene');
    //   this.scene.setVisible(true, 'CloudScene');
    // });
    //
    // this.input.keyboard.on('keydown_SPACE', event => {
    //   this.scene.setActive(false, 'CloudScene1');
    //   this.scene.setVisible(false, 'CloudScene1');
    //   this.scene.setActive(false, 'CloudScene');
    //   this.scene.setVisible(false, 'CloudScene');
    //   console.log('space');
    // });
    //
  }

  pause() {
    const board = this.scene.get('BoardScene');
    this.scene.pause('BoardScene');
    board.pauser.next(true);
    this.isPaused = true;
    console.debug('pause');
  }

  unpause() {
    const board = this.scene.get('BoardScene');
    this.scene.resume('BoardScene');
    board.pauser.next(false);
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
