import { NERO } from '../constants/colors.js';

class Pause extends Phaser.Scene {
  constructor() {
    super({
      key: 'Pause',
      active: false,
    });

    this.focused;
    this.transitioning;
  }

  createButton(name) {
    return this.add
      .image(0, 0, name)
      .setScale(this.scale)
      .setOrigin(0.5, 0)
      .setData('focused', false)
      .setName(name)
      .setInteractive()
      .on('changedata', function () {
        if (this.getData('focused')) {
          this.setTexture(`${name}-focused`);
        } else {
          this.setTexture(name);
        }
      })
      .on('pointerover', function () {
        if (!this.getData('focused')) {
          // this.scene.focused.setTexture(this.scene.focused.name);
          this.scene.focused.setData('focused', false);
          this.scene.focused = this;
          // this.setTexture(`${name}-focused`);
          this.setData('focused', true);
        }
      })
      .on('pointerdown', function () {
        if (!this.getData('focused')) {
          this.scene.focused.setData('focused', false);
          this.scene.focused = this;
          this.setData('focused', true);
        }
        this.setTexture(`${this.name}-clicked`);
      })
      .on('pointerup', function () {
        this.setTexture(`${this.name}-focused`);
        this.select();
      })
  }

  createMenu(texture, x, y, menuOptions) {
    const image = this.add
      .image(0, 0, texture)
      .setScale(this.scale)
      .setOrigin(0.5)
      .setName('image');

    const options = this.createMenuOptions(texture.x, texture.y, menuOptions);
    options.setName('options');

    const menu = this.add.container(x, y)


    menu.add([image, options]);

    return menu;
  }

  createMenuOptions(x, y, items) {
    const options = this.add.container(x, y);

    options.add(items);

    for (let i = 1; i < options.count(); i += 1) {
      options.getAt(i).setY(options.getAt(i - 1).y + (options.getAt(i - 1).height + 16) * this.scale);
    }
    options.setY(options.y - options.getBounds().height / 2 + options.getAt(0).height * this.scale / 2);

    this.focused = options.getAt(0);
    this.focused.setData('focused', true);

    return options;
  }

  create() {
    this.scene.bringToTop();
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.66)');

    const { width, height } = this.sys.game.config;
    const actualScale = Math.min(
      width / 3840,
      height / 2160
    );
    this.scale = actualScale > 0.5 ? 1 : 0.5;

    this.resume = this.createButton('resume');
    this.resume.select = () => {
      this.bounceOut(this.menu, () => this.scene.get('Interface').unpause());
    }

    this.restart = this.createButton('restart');
    this.restart.select = () => {
      this.bounceOut(this.menu, () => this.scene.get('Interface').restartLevel());
    }

    this.quit = this.createButton('quit');
    this.quit.select = () => {
      this.bounceOut(this.menu, () => this.scene.get('Interface').quit());
    }

    this.menu = this.createMenu('pause', width / 2, height / 2, [this.resume, this.restart, this.quit]);

    this.bounceIn(this.menu);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown_ENTER', () => {
      if(!this.transitioning) {
        this.focused.setTexture(`${this.focused.name}-clicked`);
      }
    }, this);
    this.input.keyboard.on('keyup_ENTER', () => {
      if(!this.transitioning) {
        this.focused.setTexture(`${this.focused.name}-focused`);
        this.focused.select();
      }
    }, this);
  }

  bounceIn(targets) {
    this.transitioning = true;
    if (Array.isArray(targets)) {
      targets.forEach(i => i.setScale(0));
    } else {
      targets.setScale(0);
    }

    this.tweens.add({
      targets,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      repeat: 0,
      ease: 'Bounce.easeOut',
      onComplete: () => this.transitioning = false,
    });
  }

  bounceOut(targets, onComplete) {
    this.transitioning = true;
    this.tweens.add({
      targets,
      scaleX: 0,
      scaleY: 0,
      duration: 400,
      repeat: 0,
      ease: 'Bounce.easeIn',
      onComplete,
    });
  }

  update() {
    const {up, down} = this.cursors;
    const menuOptions = this.menu.getByName('options');

    if(!this.transitioning) {
      if(Phaser.Input.Keyboard.JustDown(down)) {
        this.focused.setData('focused', false);
        this.focused = menuOptions.getAt(Phaser.Math.Wrap(menuOptions.getIndex(this.focused) + 1, 0, 3));
        this.focused.setData('focused', true);
      }

      if(Phaser.Input.Keyboard.JustDown(up)) {
        this.focused.setData('focused', false);
        this.focused = menuOptions.getAt(Phaser.Math.Wrap(menuOptions.getIndex(this.focused) - 1, 0, 3));
        this.focused.setData('focused', true);
      }
    }
  }

  resize(
    width = this.sys.game.config.width,
    height = this.sys.game.config.height
  ) {
  //   this.cameras.resize(width, height);
  //
  //   const scale = Math.min(width / 3840, height / 2160);
  //
  //   this.gameover.setFontSize(389 * scale);
  //   this.gameover.setX(width / 2);
  //   this.gameover.setY(height / 4);
  //
  //   this.pressToPlay.setFontSize(86 * scale);
  //   this.pressToPlay.setX(width / 2);
  //   this.pressToPlay.setY(height / 2.5);
  }
}

export default Pause;
