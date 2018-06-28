class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: 'Boot',
      active: true,
      pack: {
        files: [
          {
            type: 'image',
            key: 'loading-marge-bw',
            url: 'assets/img/loading-marge-bw.png',
          },
          {
            type: 'image',
            key: 'loading-marge-color',
            url: 'assets/img/loading-marge-color.png',
          },
        ],
      },
    });

    this.progress = 0;
    this.loaded = false;
  }

  preload() {
    this.load
      .script('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont')
      .setPath('assets/img/')
      .image({
        key: 'nearground',
        url: 'nearground.png',
      })
      .image({
        key: 'midground',
        url: 'midground.png',
      })
      .image({
        key: 'farground',
        url: 'farground.png',
      })
      .image({
        key: 'snake-head',
        url: 'snake-head.png',
      })
      .image({
        key: 'snake-body',
        url: 'snake-body.png',
      })
      .image({
        key: 'board-pattern',
        url: 'board-pattern.png',
      })
      .image({
        key: 'pinup-piece',
        url: 'pinup-piece.png',
      })
      .image({
        key: 'skb-placeholder',
        url: 'skb-placeholder.png',
      })
      .spritesheet({
        key: 'pinup',
        url: 'pinup.png',
        frameConfig: {
          frameWidth: 250,
          frameHeight: 200,
        },
      });

    const { width, height } = this.sys.game.config;
    const scale = Math.min(width / 3840, height / 2160);
    const bw = this.add
      .image(width / 3, height / 2, 'loading-marge-bw')
      .setScale(scale);
    const color = this.add
      .image(-100, height / 2, 'loading-marge-color')
      .setScale(scale);

    this.hairLowerBounds = 606 * scale;
    const bwBounds = bw.getBounds();

    this.cropCam = this.cameras.add(
      bwBounds.x,
      bwBounds.y + this.hairLowerBounds,
      bwBounds.width,
      0
    );
    this.cropCam.setScroll(
      color.getBounds().x,
      bwBounds.y + this.hairLowerBounds
    );

    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
  }

  onLoadProgress(progress) {
    const change = (progress - this.progress) * this.hairLowerBounds;
    this.cropCam.setSize(this.cropCam.width, this.cropCam.height + change);
    this.cropCam.setPosition(this.cropCam.x, this.cropCam.y - change);
    this.cropCam.setScroll(this.cropCam.scrollX, this.cropCam.scrollY - change);
    this.progress = progress;
    console.debug(`${Math.round(progress * 100)}%`);
  }

  onLoadComplete(loader, totalComplete, totalFailed) {
    WebFont.load({
      active: () => this.loaded = true,
      custom: {
        families: ['Akbar'],
        urls: ['assets/fonts/Akbar.css'],
      },
    });
    console.debug('completed: ', totalComplete);
    console.debug('failed: ', totalFailed);
  }

  update() {
    if (this.loaded) {
      this.scene.launch('Clouds');
      this.scene.start('Title');
    }
  }
}

export default Boot;
