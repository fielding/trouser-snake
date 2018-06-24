import { Observable, BehaviorSubject, fromEvent, interval, animationFrameScheduler, combineLatest }  from 'rxjs';
import { map, filter, scan, startWith, distinctUntilChanged, share, withLatestFrom, takeWhile, skip, tap} from 'rxjs/operators';
import { takeWhileInclusive } from 'rxjs-take-while-inclusive';

////////////////////////////////////////////////////////////////////////////////
// constants to move
////////////////////////////////////////////////////////////////////////////////
// const BOARD_CELL_SIZE = 20; Figure out where this is being used exactly
// add constant for pinup and board size instead of magic numbers
const PIECE_POINT_VALUE = 10;

const BOARD_COLUMNS = 25;
const BOARD_ROWS = 25;

const DIRECTIONS = {
  37: { x: -1, y: 0 },
  38: { x: 0, y: -1 },
  39: { x: 1, y: 0 },
  40: { x: 0, y: 1 },
};


////////////////////////////////////////////////////////////////////////////////
// consider moving this to a utils.js or something
////////////////////////////////////////////////////////////////////////////////
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);



////////////////////////////////////////////////////////////////////////////////
// No clue where this needs to go just yet
////////////////////////////////////////////////////////////////////////////////
const nextDirection = (previous, next) => {
  if (next.x === previous.x * -1 || next.y === previous.y * -1) {
    return previous;
  }

  return next;
};



////////////////////////////////////////////////////////////////////////////////
// Consider moving to a snake class
////////////////////////////////////////////////////////////////////////////////
  //

const isOpposite = (p, c) =>
  (p.x + c.x === 0 || Math.abs(p.x + c.x) === 20) &&
  (p.y + c.y === 0 || Math.abs(p.y + c.y) === 20);

const rotateSprite = (dir, snake) => {
  const snakeHead = snake.getFirst(true);
  if (dir.x === -1) {
    snakeHead.setRotation(0);
    snakeHead.setFlipY(false);
  } else if (dir.x === 1) {
    snakeHead.setRotation(3.14159);
    snakeHead.setFlipY(true);
  } else if (dir.y === 1) {
    snakeHead.setRotation(-1.5708);
  } else if (dir.y === -1) {
    snakeHead.setRotation(1.5708);
  }

};

const move = (snakeGroup, [direction, snakeLength]) => {
  const snake = snakeGroup.getChildren();
  const cur = snake[0];
  const prev = snake[1];
  const last = snake[snake.length - 1];
  const prevDir = {
    x: (cur.x - prev.x) / 20,
    y: (cur.y - prev.y) / 20,
  };
  const dir = isOpposite(prevDir, direction) ? prevDir : direction;

  const nx = Phaser.Math.Wrap(cur.x + 20 * dir.x, 0, 20 * BOARD_COLUMNS); // IS THIS THE RIGHT SPOT FOR ThIS
  const ny = Phaser.Math.Wrap(cur.y + 20 * dir.y, 0, 20 * BOARD_ROWS); // IS THIS THE RIGHT SPOT FOR ThIS?

  Phaser.Actions.ShiftPosition(snakeGroup.getChildren(), nx, ny, 1);

  if (snakeLength > snake.length) {
    snakeGroup.create(last.x, last.y, 'snakeSegment');
  }

  return snakeGroup;
};

const eat = (piecesGroup, snakeGroup) => {
    const snake = snakeGroup.getChildren();
    const head = snake[0];

    piecesGroup.getChildren().forEach((piece, i, arr) => {
      if (BoardScene.checkCollision(piece, head)) {
        const { x, y } = BoardScene.getRandomPosition(snake);
        piecesGroup.remove(piece, true);
        piecesGroup.create(x, y, 'pinupPiece');
        return piecesGroup;
      }
    });

  return piecesGroup;
};

////////////////////////////////////////////////////////////////////////////////
// BoardScene
////////////////////////////////////////////////////////////////////////////////
class BoardScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BoardScene',
      active: false,
    });
  }

  static checkCollision(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  static isLevelComplete(state) {
    return state.score >= 200;
  };

  static isGameOver(state) {
    const snake = state.snake.getChildren();
    const head = snake[0];
    return Phaser.Actions.GetFirst(snake, { x: head.x, y: head.y }, 1);
  }

  static getRandomPosition(snake = []) {
    const position = {
          x: getRandomNumber(0, CONST.board.columns - 1) * 20 + 10,
          y: getRandomNumber(0, CONST.board.rows - 1) * 20 + 10,
        };

    if (BoardScene.isEmptyCell(position, snake)) {
          return position;
        }

    return BoardScene.getRandomPosition(snake);
};

  static isEmptyCell(position, snake){
    return !snake.some(segment => BoardScene.checkCollision(segment, position));
  }

  generateSnake(x, y, l) {
    const snake = this.add.group();
    snake.create(10 * 20 + 10, 10 * 20 + 10, 'snakeEyeLeftFacing');

    for (let i = 1; i < l; i++) {
      snake.create((10 + i) * 20 + 10, 10 * 20 + 10, 'snakeSegment');
    }

    return snake;
  }

  generatePieces(n = 1, removeCallback) {
    const pieces = this.add.group({removeCallback});

    for (let i = 0; i < n; i++) {
      // EXTRACT FOOD COUNT CONSTANT
      pieces.create(x, y, 'pinupPiece');
      const { x, y } = BoardScene.getRandomPosition();
    }

    return pieces;
  }

  create() {
    this.registry.set('score', 0);
    this.registry.set('GameOver', false);
    this.registry.set('LevelComplete', false);
    this.cameras.main.setViewport(
      window.innerWidth / 2 - 250,
      window.innerHeight / 2 - 250,
      502,
      502
    );

    const snake = this.generateSnake(10, 10, 3);
    const length$ = new BehaviorSubject(3); // EXTRACT CONSTANT FOR INITIAL SNAKE LENGTH
    const board = this.add
      .tileSprite(0, 0, 500, 500, 'board-pattern')
      .setOrigin(0, 0);
    const pieces = this.generatePieces(2, () => {
      // this.events.emit('addScore');
      this.registry.set('score', Number(this.registry.values.score) + CONST.piecePointValue);
      length$.next(1)
    });
    const keydown$ = fromEvent(document, 'keydown');

    const direction$ = keydown$.pipe(
      map(event => DIRECTIONS[event.keyCode]),
      filter(direction => !!direction),
      startWith(DIRECTIONS[37]), // EXTRACT CONSTANT FOR INITIAL_DIRECTION AND MOVE TO CONFIG
      scan(nextDirection),
      distinctUntilChanged()
    )


    const snakeLength$ = length$.pipe(
      scan((step, snakeLength) => snakeLength + step),
      share()
    );

    const score$ = snakeLength$.pipe(
      startWith(0),
      scan((score, _) => score + 1)// EXTRACT CONSTANT FOR VALUE OF EACH PIECE EATEN
    );

    const tick$ = interval(60); // EXTRACT CONSTANT FOR GAME SPEED AND MOVE TO CONFIG
    const snake$ = tick$.pipe(
      withLatestFrom(direction$, snakeLength$, (_, direction, snakeLength) => [
        direction,
        snakeLength,
      ]),
      scan(move, snake),
      share()
    );

    const pieces$ = snake$.pipe(
      scan(eat, pieces),
      distinctUntilChanged(),
      share()
    );

    const scene$ = combineLatest(
      snake$,
      pieces$,
      score$,
      (snake, pieces, score) => ({ snake, pieces, score })
    )

    const game$ = interval(1000 / 60, animationFrameScheduler).pipe(
      withLatestFrom(scene$, (_, scene) => scene),
      takeWhileInclusive(state => !(BoardScene.isGameOver(state) || BoardScene.isLevelComplete(state)))
    ).subscribe({
      complete: () => console.log('Game Over'),
    });


}

export default BoardScene;
