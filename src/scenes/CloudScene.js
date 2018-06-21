class CloudScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'CloudScene',
      active: true,
    });
  }

  preload() {
    this.load.image({
      key: 'nearground',
      url: '../assets/img/nearground.png',
    });

    this.load.image({
      key: 'midground',
      url: '../assets/img/midground.png',
    });

    this.load.image({
      key: 'farground',
      url: '../assets/img/farground.png',
    });
  }

  create() {
    const { width, height } = this.sys.game.config;

    this.nearground = this.add
      .tileSprite(0, 0, width, height, 'nearground')
      .setOrigin(0, 0)
      .setAlpha(0.95);

    this.midground = this.add
      .tileSprite(0, 0, width, height, 'midground')
      .setOrigin(0, 0)
      .setAlpha(0.66);

    this.farground = this.add
      .tileSprite(0, 0, width, height, 'farground')
      .setOrigin(0, 0)
      .setAlpha(0.25);

    this.events.on('resize', this.resize, this);
  }

  update() {
    this.farground.tilePositionX += 0.2;
    this.midground.tilePositionX += 0.2;
    this.nearground.tilePositionX += 0.5;
  }

  resize(
    width = this.sys.game.config.width,
    height = this.sys.game.config.height
  ) {
    this.cameras.resize(width, height);
    this.farground.setSize(width, height);
    this.midground.setSize(width, height);
    this.nearground.setSize(width, height);
  }
}

export default CloudScene;
