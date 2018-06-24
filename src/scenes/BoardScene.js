import { Observable, BehaviorSubject, fromEvent, interval, animationFrameScheduler, combineLatest }  from 'rxjs';
import { map, filter, scan, startWith, distinctUntilChanged, share, withLatestFrom, takeWhile, skip, tap} from 'rxjs/operators';
import { takeWhileInclusive } from 'rxjs-take-while-inclusive';
import CONST from '../constants';

////////////////////////////////////////////////////////////////////////////////
// constants to move
////////////////////////////////////////////////////////////////////////////////
// const BOARD_CELL_SIZE = 20; Figure out where this is being used exactly
// add constant for pinup and board size instead of magic numbers
const PIECE_POINT_VALUE = 10;


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

const randomPinupPiece = () =>
  getRandomNumber(1,2) === 1 ? 'pinup-piece' : 'pinup-piece2';


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

  rotateSprite(dir, snakeGroup);

  const nx = Phaser.Math.Wrap(cur.x + 20 * dir.x, 0, 20 * CONST.board.columns); // IS THIS THE RIGHT SPOT FOR ThIS
  const ny = Phaser.Math.Wrap(cur.y + 20 * dir.y, 0, 20 * CONST.board.rows); // IS THIS THE RIGHT SPOT FOR ThIS?

  Phaser.Actions.ShiftPosition(snakeGroup.getChildren(), nx, ny, 1);

  if (snakeLength > snake.length) {
    snakeGroup.create(last.x, last.y, 'snake-body');
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
        piecesGroup.create(x, y, randomPinupPiece());
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
    snake.create(10 * 20 + 10, 10 * 20 + 10, 'snake-head');

    for (let i = 1; i < l; i++) {
      snake.create((10 + i) * 20 + 10, 10 * 20 + 10, 'snake-body');
    }

    return snake;
  }

  generatePieces(n = 1, removeCallback) {
    const pieces = this.add.group({removeCallback});

    for (let i = 0; i < n; i++) {
      // EXTRACT FOOD COUNT CONSTANT
      const { x, y } = BoardScene.getRandomPosition();
      pieces.create(x, y, randomPinupPiece());
    }

    return pieces;
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
    const snake = this.generateSnake(10, 10, CONST.initialSnakeLength);
    const length$ = new BehaviorSubject(CONST.initialSnakeLength); // EXTRACT CONSTANT FOR INITIAL SNAKE LENGTH
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
      scan((score, _) => score + CONST.piecePointValue)// EXTRACT CONSTANT FOR VALUE OF EACH PIECE EATEN
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

    // const pieceEaten$ = pieces$.pipe(
    //   skip(1),
    //   tap(() => this.events.emit('addScore'))
    // ).subscribe();

    const state$ = combineLatest(
      snake$,
      pieces$,
      score$,
      (snake, pieces, score) => ({ snake, pieces, score })
    )


    // all of the followinhg needs to be looked over/thought out

    const game$ = interval(1000 / 60, animationFrameScheduler).pipe(
      withLatestFrom(state$, (_, state) => state),
      takeWhileInclusive(state => !(BoardScene.isGameOver(state) || BoardScene.isLevelComplete(state)))
    ).subscribe({
      ticks: [],
      changeScene: key => {
        // this.scene.stop('Pinup');
        this.scene.start(key)
        this.registry.set(key, true);
      },
      next(value) {
        this.ticks.push(value);
      },
      complete() {

        if (BoardScene.isGameOver(this.ticks[this.ticks.length - 1])) {
          this.changeScene('GameOver');

        }

        if (BoardScene.isLevelComplete(this.ticks[this.ticks.length - 1])) {
          this.changeScene('LevelComplete');
        }
      },
    });
  }
}

export default BoardScene;
