import { GRID_SIZE } from '../constants/settings.js';

export class PinupPiece extends Phaser.GameObjects.Image {
  constructor(scene, position) {
    super(scene, position.x * GRID_SIZE * scene.registry.values.scale + (GRID_SIZE * scene.registry.values.scale / 2), position.y * GRID_SIZE * scene.registry.values.scale + (GRID_SIZE * scene.registry.values.scale / 2), 'pinup-piece');
    this.scene = scene;
    scene.children
      .add(this)
  }

  reposition(position) {
    this.setPosition(position.x * GRID_SIZE * this.scene.registry.values.scale + (GRID_SIZE * this.scene.registry.values.scale / 2), position.y * GRID_SIZE * this.scene.registry.values.scale + (GRID_SIZE * this.scene.registry.values.scale / 2));
  }
}
