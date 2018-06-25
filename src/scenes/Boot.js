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
            url: 'loading-marge-bw.png',
          },
          {
            type: 'image',
            key: 'loading-marge-color',
            url: 'loading-marge-color.png',
          },
        ],
      },
    });

    this.progress = 0;
  }

  preload() {
    this.load.image({
      key: 'nearground',
      url: 'nearground.png',
    });

    this.load.image({
      key: 'midground',
      url: 'midground.png',
    });

    this.load.image({
      key: 'farground',
      url: 'farground.png',
    });

    this.load.image({
      key: 'snake-head',
      url: 'snake-head.png',
    });

    this.load.image({
      key: 'snake-body',
      url: 'snake-body.png',
    });

    this.load.image({
      key: 'board-pattern',
      url: 'board-pattern.png',
    });

    this.load.image({
      key: 'pinup-piece',
      url: 'pinup-piece.png',
    });

    this.load.image({
      key: 'skb-placeholder',
      url: 'skb-placeholder.png',
    });

    this.load.spritesheet({
      key: 'pinup',
      url: 'pinup.png',
      frameConfig: {
        frameWidth: 250,
        frameHeight: 200,
      },
    });

    // from here down is to test loading

    // this.load.image({
    //   key: 'six',
    //   url: 'six.jpg'
    // });
    //
    // this.load.image({
    //   key: 'seven',
    //   url: 'six.jpg'
    // });
    //
    // this.load.image({
    //   key: 'eight',
    //   url: 'six.jpg'
    // });
    //
    // this.load.image({
    //   key: 'nine',
    //   url: 'six.jpg'
    // });

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

    this.cropCam = this.cameras.add(bwBounds.x, bwBounds.y + this.hairLowerBounds, bwBounds.width, 0);
    this.cropCam.setScroll(color.getBounds().x, bwBounds.y + this.hairLowerBounds);

    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
  }

  create() {
    this.scene.launch('Clouds');
    this.scene.start('Title');
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
    console.debug('completed: ', totalComplete);
    console.debug('failed: ', totalFailed);
  }
}

export default Boot;
