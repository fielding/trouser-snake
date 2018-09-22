import { NERO } from '../constants/colors.js';

class Pause extends Phaser.Scene {
  constructor() {
    super({
      key: 'Pause',
      active: false,
    });

    this.focused;
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

  createMenu(x, y, items) {
    const menu = this.add.container(x, y);

    items.forEach(item => {
      menu.add(item);
    });

    for (let i = 1; i < menu.count(); i += 1) {
      menu.getAt(i).setY(menu.getAt(i - 1).y + (menu.getAt(i - 1).height + 16) * this.scale);
    }
    menu.setY(menu.y - menu.getBounds().height / 2 + menu.getAt(0).height * this.scale / 2);

    this.focused = menu.getAt(0);
    this.focused.setData('focused', true);

    return menu;
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

    this.pause = this.add
      .image(width / 2, height / 2, 'pause')
      .setScale(this.scale)
      .setOrigin(0.5);

    this.resume = this.createButton('resume');
    this.resume.select = () => {
      this.scene.get('Interface').unpause();
    }

    this.restart = this.createButton('restart');
    this.restart.select = () => {
      this.scene.get('Interface').restartLevel();
    }

    this.quit = this.createButton('quit');
    this.quit.select = () => {
      this.scene.get('Interface').quit();
    }

    this.menu = this.createMenu(this.pause.x, this.pause.y, [this.resume, this.restart, this.quit]);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown_ENTER', () => {
      this.focused.setTexture(`${this.focused.name}-clicked`);
    }, this);
    this.input.keyboard.on('keyup_ENTER', () => {
      this.focused.setTexture(`${this.focused.name}-focused`);
      this.focused.select();
    }, this);
  }



  update() {
    const {up, down} = this.cursors;

    if(Phaser.Input.Keyboard.JustDown(down)) {
      this.focused.setData('focused', false);
      this.focused = this.menu.getAt(Phaser.Math.Wrap(this.menu.getIndex(this.focused) + 1, 0, 3));
      this.focused.setData('focused', true);
    }

    if(Phaser.Input.Keyboard.JustDown(up)) {
      this.focused.setData('focused', false);
      this.focused = this.menu.getAt(Phaser.Math.Wrap(this.menu.getIndex(this.focused) - 1, 0, 3));
      this.focused.setData('focused', true);
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
