import { NERO } from '../constants/colors.js';

class Interface extends Phaser.Scene {
  constructor() {
    super({
      key: 'Interface',
      active: false,
    });

    this.isPaused = false;
    this.currentScene;
    this.level;
  }

  setCurrentScene(scene) {
    this.currentScene = this.scene.get(scene);
  }

  create() {
    if (this.registry.values.level === undefined) {
      this.registry.set('level', 1);
    }

    this.music = this.sound.add('intro');
    this.music.play();

    this.scene
      .launch('Clouds')
      .bringToTop()

    this.intro();

    const { width, height } = this.sys.game.config;

    const actualScale = Math.min(
      width / 3840,
      height / 2160
    );

    const scale = actualScale > 0.5 ? 1 : 0.5;

    this.interface = this.add
      .image(0, 0, 'interface')
      .setScale(scale)
      .setOrigin(0);

    this.interface
      .setPosition((width - this.interface.width * scale) / 2, (height - this.interface.height * scale) / 2);

    this.registry.set('ui', {x: this.interface.x, y: this.interface.y, width: this.interface.width, height: this.interface.height});


    this.levelLabel = this.add
      .bitmapText(
        this.interface.x + (this.interface.width * scale * 0.26) - (80 / 2 * scale),
        this.interface.y,
        'timeliest',
        'LEVEL ',
        144
      )
      .setOrigin(0.5)
      .setScale(scale);

    this.levelValue = this.add
      .bitmapText(
        this.levelLabel.x + this.levelLabel.width - this.levelLabel.width / 2,
        this.levelLabel.y - this.levelLabel.height / 2,
        'timeliest',
        '1',
        144
      )
      .setOrigin(0)
      .setScale(scale);

   this.scoreLabel = this.add
      .bitmapText(
        this.interface.x + (this.interface.width * scale * 0.7365451389) - (200 / 2 * scale),
        this.interface.y,
        'timeliest',
        'SCORE ',
        144
      )
      .setOrigin(0.5)
      .setScale(scale);

    this.scoreValue = this.add
      .bitmapText(
        this.scoreLabel.x + this.scoreLabel.width - this.scoreLabel.width / 2,
        this.scoreLabel.y - this.scoreLabel.height / 2,
        'timeliest',
        '0',
        144
      )
      .setOrigin(0)
      .setScale(scale);

    this.input.manager.enabled = true;
    this.input.keyboard.on('keydown_P', this.pause, this);
    this.input.keyboard.on('keydown_ESC', this.pause, this);
    this.input.keyboard.on('keydown_C', this.levelComplete, this);
    this.input.keyboard.on('keydown_G', this.gameOver, this);

    this.registry.events.on('changedata', this.updateData, this);
  }

  startPlaying() {
    this.scene.stop(this.currentScene);
    this.scene.setVisible(true);
    this.scene.launch('Pinup');
    this.scene.launch('Board');
  }

  stopPlaying() {
    this.scene.setVisible(false);
    this.scene.stop('Board');
    this.scene.stop('Pinup');
  }

  gameOver() {
    if (this.scene.isActive('Board')) {
      this.stopPlaying();
      this.scene.launch('GameOver');
    }
  }

  levelComplete() {
    if (this.scene.isActive('Board')) {
      this.stopPlaying();
      this.scene.launch('LevelComplete');
      this.setCurrentScene('LevelComplete');
    }
  }

  quit() {
    if (this.isPaused) {
      this.isPaused = false;
      this.scene.stop('Pause');
    }

    this.stopPlaying();
    this.intro();
  }

  intro() {
    this.scene.setVisible(false);
    this.scene.launch('Intro');
    this.setCurrentScene('Intro');
  }

  showMenu() {
    this.scene.stop(this.currentScene);
    this.scene.setVisible(false);
    this.scene.launch('MainMenu');
    this.setCurrentScene('MainMenu');
  }

  restartLevel() {
    if (this.isPaused) {
      this.isPaused = false;
      this.scene.stop('Pause');
    }
    this.scene.stop('Pinup');
    this.scene.stop('Board');

    this.scene.launch('Pinup');
    this.scene.launch('Board');

  }

  pause() {
    if(!this.isPaused && this.scene.isActive('Board')) {
      this.scene.pause('Board');
      this.isPaused = true;
      this.scene.launch('Pause');
    }
  }

  unpause() {
    if(this.isPaused) {
      this.scene.resume('Board');
      this.isPaused = false;
      this.scene.stop('Pause');
    }
  }

  togglePause() {
    if(this.isPaused) {
      this.unpause()
    } else {
      this.pause()
    }
  }

  setScoreDisplay(score) {
    this.scoreValue.setText(score);
  }

  setLevelDisplay(level) {
    this.levelValue.setText(level);
  }

  updateData() {
    this.setScoreDisplay(this.registry.values.score);
    this.setLevelDisplay(this.registry.values.level);
    if (this.registry.values.GameOver) {
      this.gameOver();
    } else if (this.registry.values.score >= 200) {
      this.levelComplete();
    }
  }
}

export default Interface;
