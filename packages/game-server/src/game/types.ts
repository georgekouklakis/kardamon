export type CardId = string;

export interface GamePlayer {
    id: string;
    name: string;
    seat: number;
    hand: CardId[];
    pendingPass: CardId[] | null;
    score: number;
    roundPoints: number;
    trickCards: CardId[];
    isBot: boolean;
}

export type Phase = 'waiting' | 'passing' | 'playing' | 'round-over' | 'game-over';
export type PassDirection = 'left' | 'right' | 'across' | 'hold';

export interface TrickEntry {
    seat: number;
    card: CardId;
}

export interface HeartsGame {
    id: string;
    phase: Phase;
    players: GamePlayer[];
    passDirection: PassDirection;
    roundNumber: number;
    trickNumber: number;
    heartsBroken: boolean;
    currentTrick: TrickEntry[];
    trickLeaderSeat: number;
}
