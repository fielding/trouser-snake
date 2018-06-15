import { Observable, BehaviorSubject, fromEvent, interval, animationFrameScheduler, combineLatest }  from 'rxjs';
import { map, filter, scan, startWith, distinctUntilChanged, share, withLatestFrom, takeWhile, skip, tap } from 'rxjs/operators';

const BOARD_COLUMNS = 25;
const BOARD_ROWS = 25;

const DIRECTIONS = {
  37: { x: -1, y: 0 },
  38: { x: 0, y: -1 },
  39: { x: 1, y: 0 },
  40: { x: 0, y: 1 },
};

const checkCollision = (a, b) => a.x === b.x && a.y === b.y;

const isEmptyCell = (position, snake) =>
  !snake.some(segment => checkCollision(segment, position));

const isGameOver = scene => {
  const snake = scene.snake.getChildren();
  const head = snake[0];
  return Phaser.Actions.GetFirst(snake, { x: head.x, y: head.y }, 1);
};

const isOpposite = (p, c) =>
  (p.x + c.x === 0 || Math.abs(p.x + c.x) === 20) &&
  (p.y + c.y === 0 || Math.abs(p.y + c.y) === 20);

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const getRandomPosition = (snake = []) => {
    const position = {
          x: getRandomNumber(0, BOARD_COLUMNS - 1) * 20 + 10,
          y: getRandomNumber(0, BOARD_ROWS - 1) * 20 + 10,
        };

    if (isEmptyCell(position, snake)) {
          return position;
        }

    return getRandomPosition(snake);
};

const nextDirection = (previous, next) => {
  if (next.x === previous.x * -1 || next.y === previous.y * -1) {
    return previous;
  }

  return next;
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
      if (checkCollision(piece, head)) {
        const { x, y } = getRandomPosition(snake);
        piecesGroup.remove(piece, true);
        piecesGroup.create(x, y, 'pinupPiece');
        return piecesGroup;
      }
    });

  return piecesGroup;
};


class BoardScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BoardScene',
      active: true,
    });
  }

  preload() {
    this.load.image(
      'board',
      'https://justfielding.com/fun/trousersnake/assets/img/board.png'
    );

    this.load.image(
      'pinupPiece',
      'https://justfielding.com/fun/trousersnake/assets/img/pinup-piece.png'
    );

    this.load.image(
      'snakeEyeUpFacing',
      'https://justfielding.com/fun/trousersnake/assets/img/snakeEye-up-facing.png'
    );
    this.load.image(
      'snakeEyeLeftFacing',
      'https://justfielding.com/fun/trousersnake/assets/img/snakeEye-left-facing.png'
    );
    this.load.image(
      'snakeEyeDownFacing',
      'https://justfielding.com/fun/trousersnake/assets/img/snakeEye-down-facing.png'
    );
    this.load.image(
      'snakeEyeRightFacing',
      'https://justfielding.com/fun/trousersnake/assets/img/snakeEye-right-facing.png'
    );

    this.load.image(
      'snakeSegment',
      'https://justfielding.com/fun/trousersnake/assets/img/snakeSegment.png'
    );
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
      const { x, y } = getRandomPosition();
      pieces.create(x, y, 'pinupPiece');
    }

    return pieces;
  }

  create() {
    this.cameras.main.setViewport(
      window.innerWidth / 2 - 250,
      window.innerHeight / 2 - 250,
      502,
      502
    );

    const board = this.add.image(250, 250, 'board');
    const snake = this.generateSnake(10, 10, 3);
    const length$ = new BehaviorSubject(3); // EXTRACT CONSTANT FOR INITIAL SNAKE LENGTH
    const pieces = this.generatePieces(2, () => length$.next(1));
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
    // ).pipe(takeWhile(scene => !isGameOver(scene))).subscribe({
    //   complete: () => console.log('Game Over!'),
    // });

    const game$ = interval(1000 / 60, animationFrameScheduler).pipe(
      withLatestFrom(scene$, (_, scene) => scene),
      takeWhile(scene => !isGameOver(scene))
    ).subscribe({
      complete: () => console.log('Game Over'),
    });

    // ).pipe(
    //   takeWhile(scene => !isGameOver(scene))o,
    //   subscribe({
    //     complete: () => console.log('Game Over!'),
    //   })
    // );

    // const game$ = scene$.pipe(
    //   interval(1000 / 60, animationFrameScheduler),
    //   withLatestFrom(scene$, (_, scene) => scene),
    //   takeWhile(scene => !isGameOver(scene))
    // )
    // .subscribe({
    //   complete: () => console.log("Game Over!")
    // });
}

  update() {}
}

export default BoardScene;
