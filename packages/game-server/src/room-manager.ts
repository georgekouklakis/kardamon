import type { WebSocket } from 'ws';
import { HeartsController } from './game/hearts-controller.js';
import { KseriController } from './game/kseri-controller.js';
import type { MatchResultPayload, RoomController, RoomIO } from './game/room-controller.js';

// How long a room is kept alive in memory with no connected human before it's discarded.
const ROOM_ABANDONED_MS = 10 * 60 * 1000;

const PLATFORM_API_URL = process.env.PLATFORM_API_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? 'dev-internal-key';

const DEFAULT_GAME = 'hearts';
const GAME_REGISTRY: Record<string, (roomId: string, io: RoomIO) => RoomController> = {
    hearts: (roomId, io) => new HeartsController(roomId, io),
    kseri: (roomId, io) => new KseriController(roomId, io),
};

export class RoomManager {
    private rooms = new Map<string, RoomController>();
    private connections = new Map<string, WebSocket>();
    private cleanupTimers = new Map<string, ReturnType<typeof setTimeout>>();

    getOrCreate(roomId: string, gameType: string = DEFAULT_GAME): RoomController {
        if (!this.rooms.has(roomId)) {
            const factory = GAME_REGISTRY[gameType] ?? GAME_REGISTRY[DEFAULT_GAME]!;
            const io: RoomIO = {
                broadcast: () => this.broadcast(roomId),
                sendError: (playerId, message) => this.sendError(playerId, message),
                reportResult: (payload) => this.reportResult(payload),
            };
            this.rooms.set(roomId, factory(roomId, io));
        }
        return this.rooms.get(roomId)!;
    }

    joinGame(ws: WebSocket, roomId: string, playerId: string, playerName: string, gameType?: string): string | null {
        const room = this.getOrCreate(roomId, gameType);

        // Same player reconnecting (page refresh, dropped connection, etc.) — reattach
        // to their existing seat instead of trying to add them as a brand-new player.
        if (room.hasPlayer(playerId)) {
            this.clearCleanupTimer(roomId);
            this.attachSocket(ws, room, roomId, playerId);
            ws.send(JSON.stringify(room.getStateFor(playerId)));
            return null;
        }

        const err = room.addPlayer(playerId, playerName);
        if (err) return err;

        this.clearCleanupTimer(roomId);
        this.attachSocket(ws, room, roomId, playerId);

        room.start();
        this.broadcast(roomId);
        return null;
    }

    private attachSocket(ws: WebSocket, room: RoomController, roomId: string, playerId: string): void {
        this.connections.set(playerId, ws);

        ws.on('message', (raw) => {
            try {
                const action = JSON.parse(raw.toString()) as { type: string; cards: string[] };
                room.handleAction(playerId, action);
            } catch { /* ignore malformed messages */ }
        });

        ws.on('close', () => {
            // A reconnect may have already replaced this entry with a newer socket —
            // only clear it if this (now-stale) socket is still the registered one.
            if (this.connections.get(playerId) === ws) {
                this.connections.delete(playerId);
                this.scheduleCleanupIfAbandoned(room, roomId);
            }
        });
    }

    // A room whose only occupants are bots (every human has disconnected and never
    // came back) is otherwise kept in memory forever with nothing to clean it up —
    // schedule its removal, cancelled if any human reconnects in the meantime.
    private scheduleCleanupIfAbandoned(room: RoomController, roomId: string): void {
        if (room.describe().humanCount === 0) return; // no humans ever joined — shouldn't happen, but harmless

        const hasConnectedHuman = [...this.connections.entries()].some(([playerId, ws]) =>
            room.hasPlayer(playerId) && ws.readyState === 1, // 1 = OPEN
        );
        if (hasConnectedHuman) return;

        this.clearCleanupTimer(roomId);
        const timer = setTimeout(() => {
            this.rooms.delete(roomId);
            this.cleanupTimers.delete(roomId);
        }, ROOM_ABANDONED_MS);
        this.cleanupTimers.set(roomId, timer);
    }

    private clearCleanupTimer(roomId: string): void {
        const timer = this.cleanupTimers.get(roomId);
        if (timer) {
            clearTimeout(timer);
            this.cleanupTimers.delete(roomId);
        }
    }

    private sendError(playerId: string, message: string): void {
        const ws = this.connections.get(playerId);
        if (!ws || ws.readyState !== 1) return; // 1 = OPEN
        ws.send(JSON.stringify({ error: message }));
    }

    private broadcast(roomId: string): void {
        const room = this.rooms.get(roomId);
        if (!room) return;
        for (const [playerId, ws] of this.connections) {
            if (!room.hasPlayer(playerId) || ws.readyState !== 1) continue; // 1 = OPEN
            ws.send(JSON.stringify(room.getStateFor(playerId)));
        }
    }

    listRooms(): Array<{ id: string; players: number; phase: string; game: string }> {
        return Array.from(this.rooms.entries()).map(([id, room]) => {
            const { phase, humanCount } = room.describe();
            return { id, players: humanCount, phase, game: room.gameType };
        });
    }

    private reportResult(payload: MatchResultPayload): void {
        if (!PLATFORM_API_URL) return;
        fetch(`${PLATFORM_API_URL}/scores/games/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-api-key': INTERNAL_API_KEY,
            },
            body: JSON.stringify(payload),
        }).catch(() => {});
    }
}
