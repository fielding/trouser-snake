import { NERO, GREY_SUIT } from '../constants/colors.js';

class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: 'Boot',
      active: true,
      pack: {
        files: [
          {
            type: 'image',
            key: 'loading-background',
            url: 'assets/img/loading-background.png',
          },
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
      }) // Artificially inflating loading time while working on preloader
      .setPath()
      .image({
        key: 'preload-testing',
        url: 'https://justfielding.com/stash/media/queenpop.png',
      })
      .image({
        key: 'preload-testing2',
        url: 'https://justfielding.com/stash/media/queenpop2.png',
      })
      .image({
        key: 'preload-testing3',
        url: 'https://justfielding.com/stash/media/queenpop3.png',
      });

    this.cameras.main.setBackgroundColor(GREY_SUIT);
    const { width, height } = this.sys.game.config;
    const scale = Math.min(width / 3840, height / 2160);

    const offsetX = width - (3840 * scale);
    const offsetY = height - (2160 * scale);
    const adjustX = x => (x * scale) + (offsetX / 2);
    const adjustY = y => (y * scale) + (offsetY / 2);

    const margeOffsetX = (35 / 3840) * width;
    const margeOffsetY = (112 / 2160) * height;

    this.background = this.add
      .image(width / 2, height / 2, 'loading-background')
      .setScale(scale);
    this.bw = this.add
      .image((width / 2) + margeOffsetX, (height / 2) - margeOffsetY, 'loading-marge-bw')
      .setScale(scale);
   this.color = this.add
      .image(-100, (height / 2) - margeOffsetY, 'loading-marge-color')
      .setScale(scale);

    const loadingTextStyle = {
      fontFamily: 'Avenir Next Condensed',
      fontSize: 144 * scale,
      color: NERO,
      fontStyle: 'bold',
    };

    this.loadedText = this.add
      .text(adjustX(1213.6), adjustY(681.05), '0', loadingTextStyle)
      .setOrigin(0.5);

    this.totalText = this.add
      .text(adjustX(1213.6), adjustY(1425.05), '0', loadingTextStyle)
      .setOrigin(0.5);

    this.percentText1 = this.add
      .text(adjustX(2635.6), adjustY(681.05), '0', loadingTextStyle)
      .setOrigin(0.5);

    this.percentText2 = this.add
      .text(adjustX(2625.6), adjustY(1425.05), '0', loadingTextStyle)
      .setOrigin(0.5);


    this.hairLowerBounds = 606 * scale;
    const bwBounds = this.bw.getBounds();

    this.cropCam = this.cameras.add(
      bwBounds.x,
      bwBounds.y + this.hairLowerBounds,
      bwBounds.width,
      0
    );
    this.cropCam.setScroll(
      this.color.getBounds().x,
      bwBounds.y + this.hairLowerBounds
    );

    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
    this.events.on('resize', this.resize, this);
  }

  onLoadProgress(progress) {
    this.change = (progress - this.progress) * this.hairLowerBounds;
    this.cropCam.setSize(this.cropCam.width, this.cropCam.height + this.change);
    this.cropCam.setPosition(this.cropCam.x, this.cropCam.y - this.change);
    this.cropCam.setScroll(this.cropCam.scrollX, this.cropCam.scrollY - this.change);
    this.progress = progress;
    this.loadedText.setText(this.load.totalComplete);
    this.totalText.setText(this.load.totalToLoad);
    this.percentText1.setText(Math.round(progress * 100));
    this.percentText2.setText(Math.round(progress * 100));

    console.debug(`${Math.round(progress * 100)}%`);
  }

  onLoadComplete(loader, totalComplete, totalFailed) {
    WebFont.load({
      active: () => this.loaded = true,
      google: {
        families: ['Open Sans Condensed:700'],
      },
      custom: {
        families: ['Akbar'],
        urls: ['assets/fonts/Akbar.css'],
      },
    });
    this.loadedText.setText(totalComplete);
    console.debug('loaded: ', totalComplete);
    console.debug('failed: ', totalFailed);
    this.bw.setTexture('loading-marge-color');
  }

  update() {
    if (this.loaded) {
      this.scene.launch('Clouds');
      this.scene.start('Title');
    }
  }

  resize(
    width = this.sys.game.config.width,
    height = this.sys.game.config.height
  ) {
    this.cameras.main.setSize(width, height);

    const scale = Math.min(width / 3840, height / 2160);

    const offsetX = width - (3840 * scale);
    const offsetY = height - (2160 * scale);
    const adjustX = x => (x * scale) + (offsetX / 2);
    const adjustY = y => (y * scale) + (offsetY / 2);

    const margeOffsetX = (35 / 3840) * width;
    const margeOffsetY = (112 / 2160) * height;

    this.background
      .setPosition(width / 2, height / 2)
      setScale(scale);

    this.bw
      .setPosition((width / 2) + margeOffsetX, (height / 2) - margeOffsetY)
      .setScale(scale);

    this.color
      .setPosition(-100, (height / 2) - margeOffsetY)
      .setScale(scale);

    this.loadedText
      .setPosition(adjustX(1213.6), adjustY(681.05));

    this.totalText
      .setPosition(adjustX(1213.6), adjustY(1425.05));

    this.percentText1
      .setPosition(adjustX(2635.6), adjustY(681.05));

    this.percentText2
      .setPosition(adjustX(2635.6), adjustY(1425.05));

    const hairLowerBounds = 606 * scale;
    const bwBounds = this.bw.getBounds();

    this.cropCam
      .setPosition(bwBounds.x, (bwBounds.y + hairLowerBounds) - (hairLowerBounds * this.progress));
    this.cropCam
      .setScroll(
        this.color.getBounds().x,
        (bwBounds.y + hairLowerBounds) - (this.progress * hairLowerBounds)
      );
    this.cropCam
      .setSize(bwBounds.width, this.progress * hairLowerBounds);
  }
}

export default Boot;
