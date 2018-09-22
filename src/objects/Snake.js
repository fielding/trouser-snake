import {
  SNAKE_LENGTH,
  GRID_COLUMNS,
  GRID_ROWS,
  GRID_SIZE,
} from '../constants/settings.js';

export class Snake {
  constructor(scene, x, y) {
    this.scene = scene;

    const actualScale = Math.min(
      this.scene.sys.game.config.width / 3840,
      this.scene.sys.game.config.height / 2160
    );

    const scale = actualScale > 0.5 ? 1 : 0.5;

    this.scaledGridSize = GRID_SIZE * scale;

    this.position = new Phaser.Geom.Point(
      x * this.scaledGridSize + this.scaledGridSize / 2,
      y * this.scaledGridSize + this.scaledGridSize / 2
    );
    this.tailPosition = new Phaser.Geom.Point(0, 0);
    this.direction = new Phaser.Geom.Point(-this.scaledGridSize, 0);
    this.updated = true;
    this.moveTime = 0;
    this.moveDelay = 60;
    this.alive = true;
    this.length = SNAKE_LENGTH;

    this.body = this.scene.add.group();
    this.head = this.body
      .create(this.position.x, this.position.y, 'snake-head')
      .setScale(scale)
      // .setDisplayOrigin(17);

    for (let i = 1; i < SNAKE_LENGTH; i += 1) {
      this.body
        .create(
          this.position.x + i * this.scaledGridSize,
          this.position.y * this.scaledGridSize,
          'snake-body'
        )
        .setScale(scale);
    }

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = {};
    this.keys.h = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.keys.j = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.keys.k = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.keys.l = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    this.keys.w = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.a = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keys.s = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.d = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  move(time) {
    const actualScale = Math.min(
      this.scene.sys.game.config.width / 3840,
      this.scene.sys.game.config.height / 2160
    );

    const scale = actualScale > 0.5 ? 1 : 0.5;

    this.position.setTo(
      Phaser.Math.Wrap(
        this.position.x + this.direction.x,
        0,
        GRID_COLUMNS * this.scaledGridSize
      ),
      Phaser.Math.Wrap(
        this.position.y + this.direction.y,
        0,
        GRID_ROWS * this.scaledGridSize
      )
    );

    Phaser.Actions.ShiftPosition(
      this.body.getChildren(),
      this.position.x,
      this.position.y,
      1,
      this.tailPosition
    );
    this.rotateSprite();

    if (this.length > this.body.getLength()) {
      this.body
        .create(this.tailPosition.x, this.tailPosition.y, 'snake-body')
        .setScale(scale);
    }

    if (this.hitSelf()) {
      this.alive = false;
      this.scene.registry.set('GameOver', true);
      return false;
    }

    this.moveTime = time + this.moveDelay;
    return true;
  }

  handleInput() {
    const {
      left, right, up, down,
    } = this.cursors;

    if (this.updated) {
      if (
        (
          Phaser.Input.Keyboard.JustDown(up) ||
          Phaser.Input.Keyboard.JustDown(this.keys.k) ||
          Phaser.Input.Keyboard.JustDown(this.keys.w)
        ) &&
        Math.abs(this.direction.x) === this.scaledGridSize
      ) {
        this.direction.setTo(0, -this.scaledGridSize);
        this.updated = false;
      } else if (
        (
          Phaser.Input.Keyboard.JustDown(down) ||
          Phaser.Input.Keyboard.JustDown(this.keys.j) ||
          Phaser.Input.Keyboard.JustDown(this.keys.s)
        ) &&
        Math.abs(this.direction.x) === this.scaledGridSize
      ) {
        this.direction.setTo(0, this.scaledGridSize);
        this.updated = false;
      } else if (
        (
          Phaser.Input.Keyboard.JustDown(left) ||
          Phaser.Input.Keyboard.JustDown(this.keys.h) ||
          Phaser.Input.Keyboard.JustDown(this.keys.a)
        ) &&
        Math.abs(this.direction.y) === this.scaledGridSize
      ) {
        this.direction.setTo(-this.scaledGridSize, 0);
        this.updated = false;
      } else if (
        (
          Phaser.Input.Keyboard.JustDown(right) ||
          Phaser.Input.Keyboard.JustDown(this.keys.l) ||
          Phaser.Input.Keyboard.JustDown(this.keys.d)
        ) &&
        Math.abs(this.direction.y) === this.scaledGridSize
      ) {
        this.direction.setTo(this.scaledGridSize, 0);
        this.updated = false;
      }
    }
  }

  rotateSprite() {
    if (this.direction.x === -this.scaledGridSize) {
      this.head.setRotation(0);
      this.head.setFlipY(false);
    } else if (this.direction.x === this.scaledGridSize) {
      this.head.setRotation(3.14159);
      this.head.setFlipY(true);
    } else if (this.direction.y === this.scaledGridSize) {
      this.head.setRotation(-1.5708);
    } else if (this.direction.y === -this.scaledGridSize) {
      this.head.setRotation(1.5708);
    }
  }

  hitSelf() {
    return Phaser.Actions.GetFirst(
      this.body.getChildren(),
      { x: this.position.x, y: this.position.y },
      1
    );
  }

  grow() {
    this.length += 1;
  }

  update(time) {
    if (time >= this.moveTime) {
      this.updated = true;
      return this.move(time);
    }
    return false;
  }
}
