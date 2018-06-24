class GameOver extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameOver',
      active: false,
    });
  }

  preload() {
  }

  create() {
    const gameover = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 4,
        'Game Over!',
        { fontFamily: 'Akbar', fontSize: 144, color: '#282828' }
      )
      .setPadding(16)
      .setOrigin(0.5);

    const pressToPlay = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2.5,
        'Press any key to restart',
        { fontFamily: 'Akbar', fontSize: 32, color: '#282828' }
      )
      .setPadding(16)
      .setOrigin(0.5);


    this.input.manager.enabled = true;
    this.input.keyboard.on('keydown', event => this.scene.start('BoardScene'));
  }


  update() {
  }
}

export default GameOver;
