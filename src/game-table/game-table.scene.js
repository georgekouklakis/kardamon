import Phaser from 'phaser';
import { worldSettings, cardSettings } from '../kardamon-constants';

export default class GameTableScene extends Phaser.Scene {
    constructor () {
        super('game-table');

        this.cardGroup;

        window.nextTableState = this.nextTableState.bind(this);
    }

    preload () {
        this.load.atlas('cards', 'cards.png', 'cards.json');
        this.load.image('play', 'play.png');
    }

    create () {
        this.testCode();
    }

    update () {}

    nextTableState (tableStateObject) {
        const handSize = tableStateObject.hand.length;
        if (this.cardGroup) this.cardGroup.destroy(true);
        this.cardGroup = this.add.group();

        const startingPoint =
            (worldSettings.width - (handSize * cardSettings.width) / 4) / 2;

        tableStateObject.hand.forEach((cardInHand, index) => {
            const card = this.add.image(
                startingPoint + (index * cardSettings.width) / 4,
                (worldSettings.height * 3) / 4,
                'cards',
                cardInHand,
            );
            card.setAngle((index + 1 - handSize / 2) * 5);
            card.isSelected = false;
            card.setInteractive();
            card.on('pointerdown', () => {
                const direction = card.isSelected ? 1 : -1;
                if (!card.tween || !card.tween.isPlaying()) {
                    card.tween = this.tweens.add({
                        targets: card,
                        y: {
                            value:
                                card.y + (cardSettings.width / 4) * direction,
                            duration: 500,
                            ease: 'Quint.easeOut',
                        },
                    });
                    card.isSelected = !card.isSelected;
                }
            });

            this.cardGroup.add(card);
        });
    }

    testCode () {
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
            hand: hand,
        });

        const play = this.add.image(
            (worldSettings.width * 5) / 6,
            (worldSettings.height * 3) / 4,
            'play',
        );

        play.setInteractive();
        play.on('pointerdown', () => {
            const selectedCards = this.cardGroup
                .getChildren()
                .filter(card => {
                    return card.isSelected;
                })
                .map(card => {
                    return card.frame.name;
                });

            hand = hand.filter(cardInHand => {
                return !selectedCards.includes(cardInHand);
            });

            if (!hand.length) {
                hand = deal();
            }

            this.nextTableState({
                hand: hand,
            });
        });
    }
}
