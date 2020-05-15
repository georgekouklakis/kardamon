import Phaser from 'phaser';
import { worldSettings } from './kardamon-constants';
import GameTableScene from './game-table/game-table.scene';

const config = {
    type: Phaser.AUTO,
    width: worldSettings.width,
    height: worldSettings.height,
    scene: [GameTableScene],
};

export default new Phaser.Game(config);
