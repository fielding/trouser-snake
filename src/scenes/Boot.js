class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: 'Boot',
      active: true,
      // files: [
      //   { type: 'image', key: 'progress', url: 'progress-bar.png' },
      // ]
    })
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
      key: 'pinup-piece2',
      url: 'pinup-piece2.png',
    });

    this.load.image({
      key: 'pinup-placeholder',
      url: 'pinup-placeholder.png',
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

    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
  }

  create() {
    this.scene.run('Clouds');
    this.scene.start('Title');
  }


  onLoadProgress(progress) {
    console.debug(`${Math.round(progress * 100)}%`);
  }


  onLoadComplete(loader, totalComplete, totalFailed) {
    console.debug('completed: ', totalComplete);
    console.debug('failed: ', totalFailed);
  }

}

export default Boot;
