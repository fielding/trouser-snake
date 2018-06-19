class CloudScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'CloudScene',
      active: true,
    });
  }

  preload() {
    this.load.image({
      key: 'small-cloud-1',
      url: '../assets/img/small-cloud-1.png',
    });

    this.load.image({
      key: 'small-cloud-2',
      url: '../assets/img/small-cloud-2.png',
    });

    this.load.image({
      key: 'small-cloud-3',
      url: '../assets/img/small-cloud-3.png',
    });

    this.load.image({
      key: 'small-cloud-4',
      url: '../assets/img/small-cloud-4.png',
    });

    this.load.image({
      key: 'medium-cloud',
      url: 'assets/img/medium-cloud.png',
    });

    this.load.image({
      key: 'large-cloud-1',
      url: 'assets/img/large-cloud-1.png',
    });

    this.load.image({
      key: 'large-cloud-2',
      url: '../assets/img/large-cloud-2.png',
    });
  }

  create() {
    const scale = Math.min(
      this.sys.game.config.width / 3840,
      this.sys.game.config.height / 2160
    );

    this.farground = this.add.group();
    this.midground = this.add.group();
    this.nearground = this.add.group();

    this.farground.create(1476, 65, 'large-cloud-2');
    this.farground.create(-106, 1555, 'large-cloud-2');
    this.farground.create(3338, 1213, 'large-cloud-2');
    this.farground.create(3194, 1935, 'large-cloud-1');

    this.midground.create(1664, 911, 'large-cloud-1');
    this.midground.create(544, 711, 'small-cloud-2');
    this.midground.create(2686, 1686, 'small-cloud-1');
    this.midground.create(2828, 166, 'small-cloud-3');
    this.midground.create(406, 366, 'small-cloud-4');
    this.midground.create(3084, 844, 'small-cloud-4');
    this.midground.create(868, 2000, 'medium-cloud');

    this.nearground.create(166, 748, 'small-cloud-1');
    this.nearground.create(3570, 75, 'small-cloud-2');
    this.nearground.create(1950, 1505, 'small-cloud-2');
    this.nearground.create(1270, 1692, 'small-cloud-3');
    this.nearground.create(316, 1102, 'small-cloud-3');
    this.nearground.create(580, 1350, 'small-cloud-4');
    this.nearground.create(2792, 520, 'medium-cloud');

    Phaser.Actions.SetAlpha(this.farground.getChildren(), 0.25);
    Phaser.Actions.SetAlpha(this.midground.getChildren(), 0.66);
    Phaser.Actions.SetAlpha(this.nearground.getChildren(), 0.95);



    this.clouds = this.add.container(0, 0);
    this.clouds.add([...this.farground.getChildren(), ...this.midground.getChildren(), ...this.nearground.getChildren()]);
    this.clouds.setScale(scale, scale);

    this.events.on('resize', this.resize, this);


  }

  update() {
    const scale = Math.min(
      this.sys.game.config.width / 3840,
      this.sys.game.config.height / 2160
    );

    this.farground.children.iterate(child => child.x = Phaser.Math.Wrap(child.x - 0.2, 0 - (child.width / 2), (window.innerWidth / scale) + (child.width / 2)));
    this.midground.children.iterate(child => child.x = Phaser.Math.Wrap(child.x - 0.4, 0 - (child.width / 2), (window.innerWidth / scale) + (child.width / 2)));
    this.nearground.children.iterate(child => child.x = Phaser.Math.Wrap(child.x - 1, 0 - (child.width / 2), (window.innerWidth / scale) + (child.width / 2)));
  }

  resize(width, height) {
    if (width === undefined) {
      width = this.sys.game.config.width;
    }
    if (height === undefined) {
      height = this.sys.game.config.height;
    }

    this.cameras.resize(width, height);

    const scale = Math.min(
      this.sys.game.config.width / 3840,
      this.sys.game.config.height / 2160
    );

    this.clouds.setScale(scale, scale);
  }
}

export default CloudScene;
