import { Snake } from '../objects/Snake.js';
import { PinupPiece } from '../objects/PinupPiece.js'
import { GRID_COLUMNS, GRID_ROWS, GRID_SIZE } from '../constants.js';

class Board extends Phaser.Scene {
  constructor() {
    super({
      key: 'Board',
      active: false,
    });
  }

  create() {
    this.registry.set('score', 0);
    this.registry.set('GameOver', false);
    this.registry.set('LevelComplete', false);

    this.cameras.main.setViewport(
      ((window.innerWidth - 1000) / 3) * 2 + 500,
      window.innerHeight / 2 - 250,
      500,
      500
    );

    const board = this.add
      .tileSprite(0, 0, 500, 500, 'board-pattern')
      .setOrigin(0, 0);

    this.snake = new Snake(this, 10, 10);
    this.piece = new PinupPiece(this, this.getRandomEmptyPosition());
  }

  update(time) {
    if (!this.snake.alive) {
      this.registry.set('GameOver', true);
      this.scene.start('GameOver');
    } else {
      if (this.snake.update(time)) {
        this.checkCollision();
      }
      this.snake.handleInput();
    }
  }

  collided(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  checkCollision() {
    if (this.collided(this.snake.head, this.piece)) {
      this.snake.grow();
      this.piece.reposition(this.getRandomEmptyPosition());
      this.registry.set('score', this.registry.values.score + 10);
    }
  }

  isCellEmpty(cell) {
    if (this.snake != undefined && this.snake.body.getChildren().some(segment => this.collided(segment, cell))) {
      return false;
    }

    if (this.piece != undefined && this.collided(cell, this.piece)) {
      return false;
    }

    return true;
  }

  getRandomEmptyPosition() {
    const position = new Phaser.Geom.Point(
      Phaser.Math.RND.between(0, GRID_COLUMNS - 1),
      Phaser.Math.RND.between(0, GRID_ROWS - 1)
    );

    if (this.isCellEmpty(position)) {
      return position;
    }

    return this.getRandomEmptyPosition();
  }

}

export default Board;