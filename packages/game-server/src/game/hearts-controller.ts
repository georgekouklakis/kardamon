import {
    createGame, addPlayer, startRound, submitPass, playCard,
    settleTrick, trickComplete, currentActiveSeat, getStateFor,
} from './hearts.js';
import { getBotPass, getBotPlay } from './bot.js';
import type { HeartsGame } from './types.js';
import type { RoomController, RoomIO } from './room-controller.js';

const BOT_NAMES = ['Alice', 'Bob', 'Carol'];
const TRICK_DISPLAY_MS = 1500;
const BOT_THINK_MS = 850;
const NEXT_ROUND_DELAY_MS = 4500;

// RoomController for Hearts. This is a behavior-preserving extraction of what used
// to live directly on RoomManager — same rules, same pacing, just re-homed behind
// the generic interface so RoomManager can host other games too.
export class HeartsController implements RoomController {
    readonly gameType = 'hearts';
    private game: HeartsGame;

    constructor(
        roomId: string,
        private readonly io: RoomIO,
    ) {
        this.game = createGame(roomId);
    }

    hasPlayer(playerId: string): boolean {
        return this.game.players.some(p => p.id === playerId);
    }

    addPlayer(playerId: string, name: string): string | null {
        if (this.game.phase !== 'waiting') return 'Game already in progress';
        if (this.game.players.length >= 4) return 'Room is full';
        try {
            addPlayer(this.game, playerId, name);
        } catch (e) {
            return String(e);
        }
        return null;
    }

    start(): void {
        if (this.game.phase !== 'waiting') return;
        let n = 0;
        while (this.game.players.length < 4) {
            const botId = `bot-${this.game.id}-${n}`;
            const botName = BOT_NAMES[n] ?? `Bot ${n + 1}`;
            addPlayer(this.game, botId, botName, true);
            n++;
        }
        startRound(this.game);
        this.runBotPhase();
    }

    handleAction(playerId: string, action: { type: string; cards: string[] }): void {
        if (action.type === 'pass') {
            const err = submitPass(this.game, playerId, action.cards);
            if (err) return this.io.sendError(playerId, err);
            this.io.broadcast();
            if (this.game.phase === 'playing') this.runBotPhase();
        } else if (action.type === 'play' && action.cards[0]) {
            const err = playCard(this.game, playerId, action.cards[0]);
            if (err) return this.io.sendError(playerId, err);
            this.handleAfterCard();
        }
    }

    getStateFor(playerId: string): unknown {
        return getStateFor(this.game, playerId);
    }

    describe(): { phase: string; humanCount: number } {
        return {
            phase: this.game.phase,
            humanCount: this.game.players.filter(p => !p.isBot).length,
        };
    }

    private handleAfterCard(): void {
        this.io.broadcast();

        if (trickComplete(this.game)) {
            // Hold the complete trick on screen, then settle
            setTimeout(() => {
                settleTrick(this.game);
                this.io.broadcast();

                if (this.game.phase === 'game-over') {
                    this.reportResult();
                } else if (this.game.phase === 'round-over') {
                    setTimeout(() => {
                        startRound(this.game);
                        this.io.broadcast();
                        this.runBotPhase();
                    }, NEXT_ROUND_DELAY_MS);
                } else {
                    this.runBotPhase();
                }
            }, TRICK_DISPLAY_MS);
        } else {
            this.runBotPhase();
        }
    }

    private runBotPhase(): void {
        if (this.game.phase === 'passing') {
            for (const p of this.game.players.filter(q => q.isBot && q.pendingPass === null)) {
                submitPass(this.game, p.id, getBotPass(p));
            }
            this.io.broadcast();
            // submitPass may have transitioned phase to 'playing' — check at runtime
            // (the cast defeats TS's narrowing of `phase` to the outer if's branch)
            const phaseAfterPass = (this.game as HeartsGame).phase;
            if (phaseAfterPass === 'playing') this.runBotPhase();
            return;
        }

        if (this.game.phase !== 'playing') return;

        const activeSeat = currentActiveSeat(this.game);
        const active = this.game.players.find(p => p.seat === activeSeat);
        if (!active?.isBot) return;

        setTimeout(() => {
            if (this.game.phase !== 'playing') return;
            const card = getBotPlay(this.game, active.id);
            if (!card) return;
            const err = playCard(this.game, active.id, card);
            if (!err) this.handleAfterCard();
        }, BOT_THINK_MS);
    }

    private reportResult(): void {
        const minScore = Math.min(...this.game.players.map(p => p.score));
        this.io.reportResult({
            rounds: this.game.roundNumber,
            players: this.game.players.map(p => ({
                userId: p.isBot ? undefined : p.id,
                name: p.name,
                score: p.score,
                seat: p.seat,
                isBot: p.isBot,
                won: p.score === minScore,
            })),
        });
    }
}
