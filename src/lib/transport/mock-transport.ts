import type { Transport } from './transport';
import type { GameState, PlayerAction } from '../types/protocol';

const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'] as const;
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
const DECK = SUITS.flatMap(suit => RANKS.map(rank => `${suit}-${rank}`));

function deal(count: number): string[] {
    return [...DECK].sort(() => Math.random() - 0.5).slice(0, count);
}

const MY_ID = 'p0';

interface OpponentState {
    id: string;
    name: string;
    seat: number;
    handCount: number;
}

export class MockTransport implements Transport {
    private callback: ((state: GameState) => void) | null = null;
    private myHand: string[] = [];
    private tableCards: string[] = [];
    private activeSeat = 0;
    private timeouts: ReturnType<typeof setTimeout>[] = [];

    private opponents: OpponentState[] = [
        { id: 'p1', name: 'Alice', seat: 1, handCount: 10 },
        { id: 'p2', name: 'Bob', seat: 2, handCount: 10 },
        { id: 'p3', name: 'Carol', seat: 3, handCount: 10 },
    ];

    connect() {
        this.myHand = deal(10);
        this.activeSeat = 0;
        this.tableCards = [];
        setTimeout(() => this.emit(), 300);
    }

    disconnect() {
        this.timeouts.forEach(clearTimeout);
        this.timeouts = [];
        this.callback = null;
    }

    onStateUpdate(callback: (state: GameState) => void) {
        this.callback = callback;
    }

    async submitAction(action: PlayerAction) {
        if (action.type === 'play' && action.cards.length > 0) {
            this.myHand = this.myHand.filter(c => !action.cards.includes(c));
            if (this.myHand.length === 0) this.myHand = deal(10);
            this.tableCards = action.cards;
        } else {
            this.tableCards = [];
        }

        // Hand off to opponents
        this.runOpponentTurn(1);
    }

    private runOpponentTurn(seat: number) {
        this.activeSeat = seat;
        this.emit(); // show this opponent as active (table still holds previous cards)

        const t = setTimeout(() => {
            const opp = this.opponents.find(o => o.seat === seat)!;

            if (opp.handCount > 0 && Math.random() > 0.35) {
                const n = Math.min(Math.floor(Math.random() * 2) + 1, opp.handCount);
                opp.handCount -= n;
                this.tableCards = [...this.tableCards, ...deal(n)];
            }

            // Emit after acting so the played cards are visible immediately
            this.emit();

            const nextSeat = seat + 1;
            if (nextSeat < 4) {
                this.runOpponentTurn(nextSeat);
            } else {
                // Hold the last played cards long enough to see them, then back to me
                const t2 = setTimeout(() => {
                    this.activeSeat = 0;
                    this.tableCards = [];
                    this.emit();
                }, 1500);
                this.timeouts.push(t2);
            }
        }, 1500);

        this.timeouts.push(t);
    }

    private emit() {
        if (!this.callback) return;
        this.callback(this.buildState());
    }

    private buildState(): GameState {
        return {
            myId: MY_ID,
            players: [
                {
                    id: MY_ID,
                    name: 'You',
                    seat: 0,
                    hand: this.myHand,
                    handCount: this.myHand.length,
                    isActive: this.activeSeat === 0,
                },
                ...this.opponents.map(o => ({
                    id: o.id,
                    name: o.name,
                    seat: o.seat,
                    handCount: o.handCount,
                    isActive: this.activeSeat === o.seat,
                })),
            ],
            table: this.tableCards,
            actions: this.activeSeat === 0
                ? [
                      { type: 'play', label: 'Play', requiresSelection: true },
                      { type: 'pass', label: 'Pass', requiresSelection: false },
                  ]
                : [],
            phase: 'playing',
        };
    }
}
