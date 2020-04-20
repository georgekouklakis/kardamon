import Phaser from 'phaser';
import { world } from './kardamon-constants';
import GameTableScene from './game-table/game-table.scene';

const config = {
    type: Phaser.AUTO,
    width: world.x,
    height: world.y,
    scene: [GameTableScene],
};

export default new Phaser.Game(config);
