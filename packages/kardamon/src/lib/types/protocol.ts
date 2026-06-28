export type CardId = string;

export interface Player {
    id: string;
    name: string;
    seat: number;
    hand?: CardId[];    // only present for the local player
    handCount: number;  // always present; used to render card backs for opponents
    isActive: boolean;
    status?: string;    // optional label the server can attach (e.g. "Tichu!", "Passed")
}

export interface Action {
    type: string;
    label: string;
    requiresSelection: boolean;
}

export interface GameState {
    myId: string;
    players: Player[];
    table: CardId[];    // cards currently in the center (last played trick)
    actions: Action[];  // available actions for the local player; empty when not my turn
    phase?: string;
    message?: string;   // optional contextual message (e.g. "Bob asked for a King")
}

export interface PlayerAction {
    type: string;
    cards: CardId[];
}

export interface CardSheet {
    image: string;
    cardSize: { w: number; h: number };
    totalSize: { w: number; h: number };
    cards: Record<string, { x: number; y: number }>;
}
