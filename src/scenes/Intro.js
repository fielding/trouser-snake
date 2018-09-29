import { NERO } from '../constants/colors';

class Intro extends Phaser.Scene {
  constructor() {
    super({
      key: 'Intro',
      active: false,
    });
  }

  create() {
    const scale = Math.min(
      this.sys.game.config.width / 3840,
      this.sys.game.config.height / 2160
    );


    this.title = this.add
      .image(this.sys.game.config.width / 2, this.sys.game.config.height / 4, 'title')
      .setScale(0.05)
      .setAlpha(0);

    const intro = this.tweens.createTimeline();

    intro.add({
      targets: this.title,
      ease: 'Cubic.Out',
      repeat: 0,
      duration: 4000,
      props: {
        scaleX: { value: scale * 0.75 },
        scaleY: { value: scale * 0.75 },
         alpha: { value: 1, ease: 'Linear' },
      },
    });

    intro.add({
      targets: this.title,
      scaleX: scale,
      scaleY: scale,
      ease: 'Linear',
      repeat: 0,
      duration: 1500,
    });

    intro.add({
      targets: this.title,
      scaleX: 8.25,
      scaleY: 8.25,
      x: -1340,
      y: -200,
      ease: 'Cubic.Out',
      repeat: 0,
      duration: 1500,
      onComplete: () => this.scene.get('Interface').showMenu(),
    });

    intro.play();

    // this.pressToPlay = this.add
    //   .text(
    //     this.sys.game.config.width / 2,
    //     this.sys.game.config.height / 2.5,
    //     'Press any key to begin',
    //     {
    //       fontFamily: 'Akbar',
    //       fontSize: 144 * scale,
    //       color: NERO,
    //     }
    //   )
    //   .setPadding(16)
    //   .setOrigin(0.5);

    this.input.manager.enabled = true;
    this.input.keyboard.once('keydown', () => {
      this.scene.get('Interface').showMenu();
    });

    this.events.on('resize', this.resize, this);
  }

  resize(
    width = this.sys.game.config.width,
    height = this.sys.game.config.height
  ) {
    this.cameras.resize(width, height);

    const scale = Math.min(width / 3840, height / 2160);

    this.title.setScale(scale);
    // this.title.setFontSize(432 * scale);
    this.title.setX(width / 2);
    this.title.setY(height / 4);

    // this.pressToPlay.setFontSize(144 * scale);
    // this.pressToPlay.setX(width / 2);
    // this.pressToPlay.setY(height / 2.5);
  }
}

export default Intro;
