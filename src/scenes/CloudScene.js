class CloudScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'CloudScene',
      active: true,
    });
  }

  preload() {
    this.load.image(
      'large-cloud-1',
      'https://justfielding.com/fun/trousersnake/assets/img/large-cloud-1.png'
    );
    this.load.image(
      'small-cloud-1',
      'https://justfielding.com/fun/trousersnake/assets/img/small-cloud-1.png'
    );
    this.load.image(
      'small-cloud-2',
      'https://justfielding.com/fun/trousersnake/assets/img/small-cloud-2.png'
    );
  }

  create() {
    this.background = this.add.group();
    this.midground = this.add.group();
    this.nearground = this.add.group();

    this.background.create(600, 300, 'large-cloud-1');
    this.midground.create(100, 400, 'small-cloud-2');
    this.nearground.create(600, 200, 'small-cloud-1');
    // this.clouds = this.add.image(625, 400, 'clouds')
  }

  update() {
    this.background.children.iterate(child => child.x = Phaser.Math.Wrap(child.x - 0.2, child.width / -2, this.sys.game.config.width + (child.width / 2)));
    this.midground.children.iterate(child => child.x = Phaser.Math.Wrap(child.x - 0.4, child.width / -2, this.sys.game.config.width + (child.width / 2)));
    this.nearground.children.iterate(child => child.x = Phaser.Math.Wrap(child.x - 1, child.width / -2, this.sys.game.config.width + (child.width / 2)));
  }

  resize(width, height) {
  }
}

export default CloudScene;
