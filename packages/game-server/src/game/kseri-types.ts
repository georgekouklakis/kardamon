export type CardId = string;

export interface KseriPlayer {
    id: string;
    name: string;
    seat: number; // 0..3 — seats 0 & 2 are Team A, seats 1 & 3 are Team B
    isBot: boolean;
    hand: CardId[];
    captured: CardId[];  // all cards this individual player has captured this deal
    sweeps: number;       // plain sweeps this deal (10 pts each)
    doubleSweeps: number; // "kseri of 2xJ" sweeps this deal (20 pts each)
}

export type KseriPhase = 'waiting' | 'playing' | 'deal-over' | 'match-over';

// A card in the play pile. `seat` is omitted for the initial face-up deal (nobody
// "played" those) and set to the playing seat for every card placed via a turn.
export interface PileEntry {
    card: CardId;
    seat?: number;
}

export interface KseriGame {
    id: string;
    phase: KseriPhase;
    players: KseriPlayer[];
    pile: PileEntry[];
    deck: CardId[];
    turnSeat: number;
    lastCapturerSeat: number | null; // takes any cards left on the floor when the deck runs out
    dealNumber: number; // 1..3
    teamScores: [number, number]; // [Team A, Team B], cumulative across deals
    dealMessage?: string; // human-readable summary of the last deal's scoring
}
