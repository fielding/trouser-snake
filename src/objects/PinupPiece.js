import { GRID_SIZE } from '../constants/settings.js';

export class PinupPiece extends Phaser.GameObjects.Image {
  constructor(scene, position) {
    super(scene, position.x * GRID_SIZE + (GRID_SIZE / 2), position.y * GRID_SIZE + (GRID_SIZE / 2), 'pinup-piece');
    scene.children.add(this);
  }

  reposition(position) {
    this.setPosition(position.x * GRID_SIZE + (GRID_SIZE / 2), position.y * GRID_SIZE + (GRID_SIZE / 2));
  }
}
