import { addPlayer, createGame, dealNext, getStateFor, playCard, startMatch } from './kseri.js';
import { getBotPlay } from './kseri-bot.js';
import type { KseriGame } from './kseri-types.js';
import type { RoomController, RoomIO } from './room-controller.js';

const BOT_NAMES = ['Alice', 'Bob', 'Carol'];
const BOT_THINK_MS = 900;
const DEAL_OVER_DELAY_MS = 4000;

export class KseriController implements RoomController {
    readonly gameType = 'kseri';
    private game: KseriGame;

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
        startMatch(this.game);
        this.runBotPhase();
    }

    handleAction(playerId: string, action: { type: string; cards: string[] }): void {
        if (action.type !== 'play' || !action.cards[0]) return;
        const err = playCard(this.game, playerId, action.cards[0]);
        if (err) return this.io.sendError(playerId, err);
        this.handleAfterPlay();
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

    private handleAfterPlay(): void {
        this.io.broadcast();

        if (this.game.phase === 'deal-over') {
            setTimeout(() => {
                dealNext(this.game);
                this.io.broadcast();
                this.runBotPhase();
            }, DEAL_OVER_DELAY_MS);
        } else if (this.game.phase === 'match-over') {
            this.reportResult();
        } else {
            this.runBotPhase();
        }
    }

    private runBotPhase(): void {
        if (this.game.phase !== 'playing') return;
        const active = this.game.players.find(p => p.seat === this.game.turnSeat);
        if (!active?.isBot) return;

        setTimeout(() => {
            if (this.game.phase !== 'playing') return;
            const card = getBotPlay(this.game, active.id);
            if (!card) return;
            const err = playCard(this.game, active.id, card);
            if (!err) this.handleAfterPlay();
        }, BOT_THINK_MS);
    }

    private reportResult(): void {
        const [teamAScore, teamBScore] = this.game.teamScores;
        this.io.reportResult({
            rounds: this.game.dealNumber,
            players: this.game.players.map(p => {
                const teamScore = p.seat % 2 === 0 ? teamAScore : teamBScore;
                return {
                    userId: p.isBot ? undefined : p.id,
                    name: p.name,
                    score: teamScore,
                    seat: p.seat,
                    isBot: p.isBot,
                    won: teamAScore !== teamBScore && teamScore === Math.max(teamAScore, teamBScore),
                };
            }),
        });
    }
}
