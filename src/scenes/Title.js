import { NERO } from '../constants/colors';

class Title extends Phaser.Scene {
  constructor() {
    super({
      key: 'Title',
      active: false,
    });
  }

  preload() {}

  create() {
    const scale = Math.min(
      this.sys.game.config.width / 3840,
      this.sys.game.config.height / 2160
    );

    this.title = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 4,
        'TrouserSnake',
        {
          fontFamily: 'Akbar',
          fontSize: 432 * scale,
          color: NERO,
        }
      )
      .setPadding(16)
      .setOrigin(0.5);

    this.pressToPlay = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2.5,
        'Press any key to begin',
        {
          fontFamily: 'Akbar',
          fontSize: 144 * scale,
          color: NERO,
        }
      )
      .setPadding(16)
      .setOrigin(0.5);

    this.input.manager.enabled = true;
    this.input.keyboard.on('keydown', event => {
      this.scene.start('Interface')
    });

    this.events.on('resize', this.resize, this);
  }

  update() {}

  resize(
    width = this.sys.game.config.width,
    height = this.sys.game.config.height
  ) {
    this.cameras.resize(width, height);

    const scale = Math.min(width / 3840, height / 2160);

    this.title.setFontSize(432 * scale);
    this.title.setX(width / 2);
    this.title.setY(height / 4);

    this.pressToPlay.setFontSize(144 * scale);
    this.pressToPlay.setX(width/ 2);
    this.pressToPlay.setY(height / 2.5);



  }
}

export default Title;
