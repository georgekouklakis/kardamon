export interface MatchResultPlayer {
    userId?: string;
    name: string;
    score: number;
    seat: number;
    isBot: boolean;
    won: boolean;
}

export interface MatchResultPayload {
    rounds: number;
    players: MatchResultPlayer[];
}

// Callbacks a RoomController uses to talk back to the transport layer (RoomManager),
// without needing to know about WebSockets, connections, or HTTP.
export interface RoomIO {
    broadcast(): void;
    sendError(playerId: string, message: string): void;
    reportResult(payload: MatchResultPayload): void;
}

// One instance per room. Encapsulates a single game's rules, bot scheduling, and
// pacing (trick delays, deal delays, etc.) — RoomManager only ever talks to this
// interface, never to a specific game engine.
export interface RoomController {
    readonly gameType: string;

    hasPlayer(playerId: string): boolean;

    // Adds a human player. Returns an error string (e.g. "Room is full",
    // "Game already in progress") or null on success.
    addPlayer(playerId: string, name: string): string | null;

    // Fills remaining seats with bots and begins play. Safe to call after every
    // successful addPlayer — a no-op once the game has already started.
    start(): void;

    handleAction(playerId: string, action: { type: string; cards: string[] }): void;

    // GameState-shaped JSON (see kardamon's protocol.ts) for this specific player.
    getStateFor(playerId: string): unknown;

    describe(): { phase: string; humanCount: number };
}
