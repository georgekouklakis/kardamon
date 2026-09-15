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
    selectCount: number; // exact number of hand cards this action needs selected
}

// One card on the table, and who put it there. `playerId` is omitted for cards that
// were dealt face-up rather than played (e.g. Kseri's initial pile) — the client
// renders those with no "flew in from a player" animation/rotation.
export interface TablePlay {
    card: CardId;
    playerId?: string;
}

export interface GameState {
    myId: string;
    players: Player[];
    table: TablePlay[]; // cards currently on the table, in stacking/play order
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
