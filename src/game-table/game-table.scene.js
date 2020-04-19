import Phaser from 'phaser';

export default class GameTableScene extends Phaser.Scene {
    constructor() {
        super('game-table');
        window.nextTableState = this.nextTableState.bind(this);
    }

    preload() {
        this.load.atlas('cards', 'cards.png', 'cards.json');
    }

    create() {
        this.nextTableState({
            'hand': ['clubs3', 'diamonds2', 'hearts3']
        });
    }

    update() {

    }

    nextTableState(tableStateObject) {
        tableStateObject.hand.forEach((cardInHand, index) => {
            const card = this.add.image(200 + index * 35, 300, 'cards', cardInHand);
            card.isSelected = false;
            card.setInteractive();
            card.on('pointerdown', () => {
                const direction = card.isSelected ? 1 : -1;
                if (!card.tween || !card.tween.isPlaying()) {
                    card.tween = this.tweens.add({
                        targets: card,
                        y: { value: card.y + 35 * direction, duration: 200, ease: 'Bounce.easeOut' }
                    });
                    card.isSelected = !card.isSelected;    
                }
            });
        });
    }
}