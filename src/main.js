import Phaser from 'phaser';

import GameTableScene from './game-table/game-table.scene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    scene: [GameTableScene],
};

export default new Phaser.Game(config);
