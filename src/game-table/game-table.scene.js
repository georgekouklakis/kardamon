import Phaser from 'phaser';
import { world } from '../kardamon-constants';

export default class GameTableScene extends Phaser.Scene {
    constructor() {
        super('game-table');

        this.cardGroup;

        window.nextTableState = this.nextTableState.bind(this);
    }

    preload() {
        this.load.atlas('cards', 'cards.png', 'cards.json');
        this.load.image('play', 'play.png');
    }

    create() {
        this.sampleCard = this.textures.get('cards').get(0);

        this.testCode();
    }

    update() {

    }

    nextTableState(tableStateObject) {
        const handSize = tableStateObject.hand.length;
        if (this.cardGroup) this.cardGroup.destroy(true);
        this.cardGroup = this.add.group();

        const startingPoint = (world.x - (handSize * this.sampleCard.width / 4)) / 2;

        tableStateObject.hand.forEach((cardInHand, index) => {
            const card = this.add.image(startingPoint + index * this.sampleCard.width / 4, world.y * 3 / 4, 'cards', cardInHand);
            card.setAngle(((index + 1) - (handSize / 2)) * 5);
            card.isSelected = false;
            card.setInteractive();
            card.on('pointerdown', () => {
                const direction = card.isSelected ? 1 : -1;
                if (!card.tween || !card.tween.isPlaying()) {
                    card.tween = this.tweens.add({
                        targets: card,
                        y: { value: card.y + (this.sampleCard.width / 4) * direction, duration: 500, ease: 'Quint.easeOut' }
                    });
                    card.isSelected = !card.isSelected;    
                }
            });

            this.cardGroup.add(card);
        });
    }

    testCode() {
        const frames = this.textures.get('cards').getFrameNames();
        const deal = () => {
            const hand = [];

            for (let i = 0; i < 10; i++) {
                hand.push(Phaser.Math.RND.pick(frames));
            }

            return hand;
        };

        let hand = deal();

        this.nextTableState({
            hand: hand
        });

        const play = this.add.image(world.x * 5 / 6, world.y * 3 / 4, 'play');
        play.setInteractive();
        play.on('pointerdown', () => {
            const selectedCards = this.cardGroup.getChildren()
                .filter((card) => { return card.isSelected; })
                .map((card) => { return card.frame.name; });

            hand = hand.filter((cardInHand) => {
                return !selectedCards.includes(cardInHand);
            });

            if (!hand.length) {
                hand = deal();
            }

            this.nextTableState({
                hand: hand
            });
        });
    }
}