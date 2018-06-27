import { SNAKE_LENGTH, GRID_COLUMNS, GRID_ROWS, GRID_SIZE } from '../constants'

export class Snake {
  constructor(scene, x, y) {
    this.position = new Phaser.Geom.Point(x * GRID_SIZE + GRID_SIZE / 2, y * GRID_SIZE + GRID_SIZE / 2);
    this.tailPosition = new Phaser.Geom.Point(0, 0);
    this.direction = new Phaser.Geom.Point(-GRID_SIZE, 0);
    this.updated = true;
    this.moveTime = 0;
    this.moveDelay = 60;
    this.alive = true;
    this.length = SNAKE_LENGTH;


    this.body = scene.add.group();
    this.head = this.body.create(this.position.x, this.position.y, 'snake-head');

    for (let i = 1; i < SNAKE_LENGTH; i += 1) {
      this.body.create(this.position.x + (i * GRID_SIZE), this.position.y * GRID_SIZE, 'snake-body');
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  move(time) {
    this.position.setTo(
      Phaser.Math.Wrap(this.position.x + this.direction.x, 0, GRID_COLUMNS * GRID_SIZE),
      Phaser.Math.Wrap(this.position.y + this.direction.y, 0, GRID_ROWS * GRID_SIZE)
    );

    Phaser.Actions.ShiftPosition(this.body.getChildren(), this.position.x, this.position.y, 1, this.tailPosition);
    this.moveTime = time + this.moveDelay;
    this.rotateSprite();

    if (this.hitSelf()) {
      this.alive = false;
      return false;
    }

    if (this.length > this.body.getLength()) {
      this.body.create(this.tailPosition.x, this.tailPosition.y, 'snake-body');
    }




    return true;
  }

  handleInput() {
    const {left, right, up, down} = this.cursors;
    if (this.updated) {
      if (Phaser.Input.Keyboard.JustDown(up) && Math.abs(this.direction.x) === GRID_SIZE) {
      this.direction.setTo(0, -GRID_SIZE);
        this.updated = false;
      } else if (Phaser.Input.Keyboard.JustDown(down) && Math.abs(this.direction.x) === GRID_SIZE) {
      this.direction.setTo(0, GRID_SIZE);
        this.updated = false;
      } else if (Phaser.Input.Keyboard.JustDown(left) && Math.abs(this.direction.y) === GRID_SIZE) {
      this.direction.setTo(-GRID_SIZE, 0);
        this.updated = false;
      } else if (Phaser.Input.Keyboard.JustDown(right) && Math.abs(this.direction.y) === GRID_SIZE) {
      this.direction.setTo(GRID_SIZE, 0);
        this.updated = false;
      }
    }
  }

  rotateSprite() {
    if (this.direction.x === -GRID_SIZE) {
      this.head.setRotation(0);
      this.head.setFlipY(false);
    } else if (this.direction.x === GRID_SIZE) {
      this.head.setRotation(3.14159);
      this.head.setFlipY(true);
    } else if (this.direction.y === GRID_SIZE) {
      this.head.setRotation(-1.5708);
    } else if (this.direction.y === -GRID_SIZE) {
      this.head.setRotation(1.5708);
    }
  }

  hitSelf() {
    return Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.position.x, y: this.position.y }, 1);
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
