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
    //this.scene.moveBelow('Interface');

    // replace with registy scale factor
    const actualScale = Math.min(
      this.sys.game.config.width / 3840,
      this.sys.game.config.height / 2160
    );

    const scale = actualScale > 0.5 ? 1 : 0.5;

    this.cameras.main.setViewport(
      this.registry.values.ui.x + (this.registry.values.ui.width * 0.2638888889 * scale) - (1024 * scale / 2),
      this.registry.values.ui.y + (this.registry.values.ui.height / 2 * scale) - (1024 * scale / 2),
      // 875 * scale,
      // 580 * scale,
      1024 * scale,
      1024 * scale
    );

    const placeholder = this.add
      .image(0, 0, 'skb-placeholder')
      .setScale(scale)
      .setOrigin(0);

    let frame = 0;
    // if(this.collected) this.collected.clear()
    this.collected = this.add.group();
    this.pieces = this.add.group();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        this.pieces
          .create(j * ((1024 * scale) / 4) , i * ((1024 * scale) / 5), 'pinup', frame)
          .setOrigin(0, 0)
          .setScale(scale);
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
