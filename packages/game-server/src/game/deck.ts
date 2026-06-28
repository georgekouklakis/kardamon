export const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'] as const;
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

export const DECK: string[] = SUITS.flatMap(suit =>
    RANKS.map(rank => `${suit}-${rank}`)
);

export function suit(card: string): string {
    return card.split('-')[0] ?? '';
}

export function rank(card: string): string {
    return card.split('-')[1] ?? '';
}

const RANK_ORDER = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function rankValue(card: string): number {
    return RANK_ORDER.indexOf(rank(card));
}

export function cardPoints(card: string): number {
    if (card === 'spades-Q') return 13;
    if (suit(card) === 'hearts') return 1;
    return 0;
}

export function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function dealDeck(): string[][] {
    const shuffled = shuffle(DECK);
    return [
        shuffled.slice(0, 13),
        shuffled.slice(13, 26),
        shuffled.slice(26, 39),
        shuffled.slice(39, 52),
    ];
}
