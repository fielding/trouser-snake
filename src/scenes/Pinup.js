const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

class Pinup extends Phaser.Scene {
  constructor() {
    super({
      key: 'Pinup',
      active: false,
    });
  }

  create() {
    this.cameras.main.setViewport(
      (window.innerWidth - 1000) / 3,
      window.innerHeight / 2 - 250,
      500,
      500
    );

    const placeholder = this.add
      .image(250, 250, 'skb-placeholder')
      .setScale(0.5);

    let frame = 0;
    this.collected = this.add.group();
    this.pieces = this.add.group();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        this.pieces
          .create(j * 125, i * 100, 'pinup', frame)
          .setOrigin(0, 0)
          .setScale(0.5);
        frame++;
      }
    }

    Phaser.Actions.SetVisible(this.pieces.getChildren(), false);

    this.registry.events.on('changedata', this.updateData, this);
  }

  showRandomPiece() {
    const difference = (a, b) => {
      const s = new Set(b);
      return a.filter(x => !s.has(x));
    };

    const invisiblePieces = difference(
      this.pieces.getChildren(),
      this.collected.getChildren()
    );
    const randomPiece =
      invisiblePieces[
        getRandomNumber(
          0,
          this.pieces.getLength() - this.collected.getLength() - 1
        )
      ];
    this.collected.add(randomPiece);
  }

  update() {
    Phaser.Actions.SetVisible(this.collected.getChildren(), true);
  }

  updateData(parent, key, data) {
    if ((key === 'LevelComplete' || key === 'GameOver') && data === true) {
      this.reset();
    }

    if (
      key === 'score' &&
      data <= 200 &&
      this.registry.values.GameOver === false &&
      this.registry.values.LevelComplete === false
    ) {
      this.showRandomPiece();
    }
  }

  reset() {
    console.debug('resetting pinup scene');
    this.collected.clear();
    this.collected = this.add.group();
    Phaser.Actions.SetVisible(this.pieces.getChildren(), false);
  }
}

export default Pinup;
