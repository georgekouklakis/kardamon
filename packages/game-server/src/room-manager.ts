import type { WebSocket } from 'ws';
import {
    createGame, addPlayer, startRound, submitPass, playCard,
    settleTrick, trickComplete, currentActiveSeat, getStateFor,
} from './game/hearts.js';
import { getBotPass, getBotPlay } from './game/bot.js';
import type { HeartsGame } from './game/types.js';

const BOT_NAMES = ['Alice', 'Bob', 'Carol'];
const TRICK_DISPLAY_MS = 1500;
const BOT_THINK_MS = 850;
const NEXT_ROUND_DELAY_MS = 4500;

const PLATFORM_API_URL = process.env.PLATFORM_API_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? 'dev-internal-key';

export class RoomManager {
    private games = new Map<string, HeartsGame>();
    private connections = new Map<string, WebSocket>();

    getOrCreate(roomId: string): HeartsGame {
        if (!this.games.has(roomId)) {
            this.games.set(roomId, createGame(roomId));
        }
        return this.games.get(roomId)!;
    }

    joinGame(ws: WebSocket, roomId: string, playerId: string, playerName: string): string | null {
        const game = this.getOrCreate(roomId);

        if (game.phase !== 'waiting') return 'Game already in progress';
        if (game.players.length >= 4) return 'Room is full';

        try {
            addPlayer(game, playerId, playerName);
        } catch (e) {
            return String(e);
        }

        this.connections.set(playerId, ws);

        ws.on('message', (raw) => {
            try {
                const action = JSON.parse(raw.toString()) as { type: string; cards: string[] };
                this.handleAction(game, playerId, action);
            } catch { /* ignore malformed messages */ }
        });

        ws.on('close', () => {
            this.connections.delete(playerId);
        });

        this.fillBotsAndStart(game, roomId);
        this.broadcast(game);
        return null;
    }

    private fillBotsAndStart(game: HeartsGame, roomId: string): void {
        let n = 0;
        while (game.players.length < 4) {
            const botId = `bot-${roomId}-${n}`;
            const botName = BOT_NAMES[n] ?? `Bot ${n + 1}`;
            addPlayer(game, botId, botName, true);
            n++;
        }
        startRound(game);
        this.runBotPhase(game);
    }

    private handleAction(game: HeartsGame, playerId: string, action: { type: string; cards: string[] }): void {
        if (action.type === 'pass') {
            const err = submitPass(game, playerId, action.cards);
            if (err) return;
            this.broadcast(game);
            if (game.phase === 'playing') this.runBotPhase(game);
        } else if (action.type === 'play' && action.cards[0]) {
            const err = playCard(game, playerId, action.cards[0]);
            if (err) return;
            this.handleAfterCard(game);
        }
    }

    private handleAfterCard(game: HeartsGame): void {
        this.broadcast(game);

        if (trickComplete(game)) {
            // Hold the complete trick on screen, then settle
            setTimeout(() => {
                settleTrick(game);
                this.broadcast(game);

                if (game.phase === 'game-over') {
                    this.reportResult(game);
                } else if (game.phase === 'round-over') {
                    setTimeout(() => {
                        startRound(game);
                        this.broadcast(game);
                        this.runBotPhase(game);
                    }, NEXT_ROUND_DELAY_MS);
                } else {
                    this.runBotPhase(game);
                }
            }, TRICK_DISPLAY_MS);
        } else {
            this.runBotPhase(game);
        }
    }

    private runBotPhase(game: HeartsGame): void {
        if (game.phase === 'passing') {
            for (const p of game.players.filter(q => q.isBot && q.pendingPass === null)) {
                submitPass(game, p.id, getBotPass(p));
            }
            this.broadcast(game);
            if (game.phase === 'playing') this.runBotPhase(game);
            return;
        }

        if (game.phase !== 'playing') return;

        const activeSeat = currentActiveSeat(game);
        const active = game.players.find(p => p.seat === activeSeat);
        if (!active?.isBot) return;

        setTimeout(() => {
            if (game.phase !== 'playing') return;
            const card = getBotPlay(game, active.id);
            if (!card) return;
            const err = playCard(game, active.id, card);
            if (!err) this.handleAfterCard(game);
        }, BOT_THINK_MS);
    }

    private broadcast(game: HeartsGame): void {
        for (const player of game.players) {
            const ws = this.connections.get(player.id);
            if (!ws || ws.readyState !== 1) continue; // 1 = OPEN
            ws.send(JSON.stringify(getStateFor(game, player.id)));
        }
    }

    listRooms(): Array<{ id: string; players: number; phase: string }> {
        return Array.from(this.games.values()).map(g => ({
            id: g.id,
            players: g.players.filter(p => !p.isBot).length,
            phase: g.phase,
        }));
    }

    private reportResult(game: HeartsGame): void {
        if (!PLATFORM_API_URL) return;
        const minScore = Math.min(...game.players.map(p => p.score));
        fetch(`${PLATFORM_API_URL}/scores/games/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-api-key': INTERNAL_API_KEY,
            },
            body: JSON.stringify({
                rounds: game.roundNumber,
                players: game.players.map(p => ({
                    userId: p.isBot ? undefined : p.id,
                    name: p.name,
                    score: p.score,
                    seat: p.seat,
                    isBot: p.isBot,
                    won: p.score === minScore,
                })),
            }),
        }).catch(() => {});
    }
}
