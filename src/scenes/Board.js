import { Snake } from '../objects/Snake.js';
import { PinupPiece } from '../objects/PinupPiece.js'
import { GRID_COLUMNS, GRID_ROWS, GRID_SIZE } from '../constants/settings.js';

class Board extends Phaser.Scene {
  constructor() {
    super({
      key: 'Board',
      active: false,
    });
  }

  create() {
    if(this.registry.values.level === undefined) {
      this.registry.set('level', 1);
    }
    this.registry.set('score', 0);
    this.registry.set('GameOver', false);
    // this.registry.set('LevelComplete', false);

    const { width, height } = this.sys.game.config;
    const actualScale = Math.min(width / 3840, height / 2160);
    const scale = actualScale > 0.5 ? 1 : 0.5;

    this.cameras.main
      .setViewport(
        this.registry.values.ui.x + (this.registry.values.ui.width * 0.7365451389 * scale) - (1024 * scale / 2),
        this.registry.values.ui.y + (this.registry.values.ui.height / 2 * scale) - (1024 * scale / 2),
        1024 * scale,
        1024 * scale
      )
      .setOrigin(0);

    this.board = this.add
      .tileSprite(0, 0, 1024, 1024, 'board-pattern')
      .setOrigin(0, 0)
      .setScale(scale);


    this.snake = new Snake(this, 16, 16);
    this.piece = new PinupPiece(this, this.getRandomEmptyPosition());
    this.piece.setScale(scale);

    this.events.on('resize', this.resize, this);
  }

  update(time) {
    if (this.snake.update(time)) {
      this.checkCollision();
    }
      this.snake.handleInput();
  }

  collided(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  checkCollision() {
    if (this.collided(this.snake.head, this.piece)) {
      this.registry.set('score', this.registry.values.score + 10);
      this.snake.grow();
      this.piece.reposition(this.getRandomEmptyPosition());
    }
  }

  isCellEmpty(cell) {
    const actualGridSize = GRID_SIZE * this.registry.values.scale;
    const adjustedCell = {
      x: cell.x * actualGridSize + (actualGridSize / 2),
      y: cell.y * actualGridSize + (actualGridSize / 2)
    }

    if (this.snake != undefined && this.snake.body.getChildren().some(segment => this.collided(segment, adjustedCell))) {
      return false;
    }

    if (this.piece != undefined && this.collided(adjustedCell, this.piece)) {
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

  resize(
    width = this.sys.game.config.width,
    height = this.sys.game.config.height
  ) {
    console.log('resizing board');
    // this.cameras.resize(width, height);
    const scale = Math.min(width / 3840, height / 2160);

    this.cameras.main.setSize(1024 * scale, 1024 * scale);
    // this.board.setSize(1351 * scale, 1351 * scale);
  }
}
export default Board;
