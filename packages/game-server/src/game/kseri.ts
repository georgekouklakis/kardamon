import { DECK, rank, shuffle, sortHand } from './deck.js';
import type { KseriGame, KseriPlayer, PileEntry } from './kseri-types.js';

const HAND_SIZE = 6;
const FLOOR_SIZE = 4;
const MATCH_DEALS = 3;
const BIG_RANKS = new Set(['A', 'K', 'Q', 'J', '10']);

export function createGame(id: string): KseriGame {
    return {
        id,
        phase: 'waiting',
        players: [],
        pile: [],
        deck: [],
        turnSeat: 0,
        lastCapturerSeat: null,
        dealNumber: 0,
        teamScores: [0, 0],
    };
}

export function addPlayer(game: KseriGame, id: string, name: string, isBot = false): void {
    if (game.players.length >= 4) throw new Error('Room is full');
    game.players.push({
        id, name, isBot,
        seat: game.players.length,
        hand: [],
        captured: [],
        sweeps: 0,
        doubleSweeps: 0,
    });
}

function teamOf(seat: number): 0 | 1 {
    return (seat % 2) as 0 | 1; // seats 0,2 -> Team A; seats 1,3 -> Team B
}

export function startMatch(game: KseriGame): void {
    game.dealNumber = 0;
    game.teamScores = [0, 0];
    dealNext(game);
}

// Deals the next deal (1st call from startMatch, subsequent calls from the
// controller after a deal-over pause). Resets per-deal state; teamScores persist.
export function dealNext(game: KseriGame): void {
    game.dealNumber++;
    game.players.forEach(p => {
        p.hand = [];
        p.captured = [];
        p.sweeps = 0;
        p.doubleSweeps = 0;
    });
    game.lastCapturerSeat = null;

    let deck = shuffle(DECK);

    // Form the initial 4-card pile (first dealt = bottom, 4th = top). If the top two
    // cards match rank, or the top card is a Jack, the pile is invalid — reshuffle it
    // back into the deck and re-deal until it's valid.
    let pileCards: string[];
    for (;;) {
        pileCards = deck.slice(0, FLOOR_SIZE);
        const top = pileCards[FLOOR_SIZE - 1]!;
        const second = pileCards[FLOOR_SIZE - 2]!;
        if (rank(top) !== 'J' && rank(top) !== rank(second)) {
            deck = deck.slice(FLOOR_SIZE);
            break;
        }
        deck = shuffle(deck); // top 4 (now known invalid) go right back in and reshuffle
    }
    game.pile = pileCards.map(card => ({ card }));

    dealRound(game, deck);
    game.deck = deck;

    game.turnSeat = (game.dealNumber - 1) % game.players.length;
    game.phase = 'playing';
}

function dealRound(game: KseriGame, deck: string[]): void {
    for (const player of game.players) {
        player.hand.push(...deck.splice(0, HAND_SIZE));
    }
}

export function validatePlay(game: KseriGame, playerId: string, playedCard: string): string | null {
    if (game.phase !== 'playing') return 'Not in playing phase';
    const player = game.players.find(p => p.id === playerId);
    if (!player) return 'Player not found';
    if (player.seat !== game.turnSeat) return 'Not your turn';
    if (!player.hand.includes(playedCard)) return 'Card not in hand';
    return null;
}

export function playCard(game: KseriGame, playerId: string, playedCard: string): string | null {
    const err = validatePlay(game, playerId, playedCard);
    if (err) return err;

    const player = game.players.find(p => p.id === playerId)!;
    player.hand = player.hand.filter(c => c !== playedCard);

    const pileTop = game.pile[game.pile.length - 1];
    const captures = game.pile.length > 0
        && (rank(playedCard) === rank(pileTop!.card) || rank(playedCard) === 'J');

    if (captures) {
        const isLone = game.pile.length === 1;
        const isRankMatch = rank(playedCard) === rank(pileTop!.card);

        player.captured.push(...game.pile.map(p => p.card), playedCard);
        game.pile = [];
        game.lastCapturerSeat = player.seat;

        // Xeri: capturing a lone card by rank-matching it (10, or 20 if both are
        // Jacks). Wildcard-capturing a lone *non*-Jack card with a Jack earns no
        // bonus — it's a bit of a wasted Jack, just a normal 1-card capture.
        if (isLone && isRankMatch) {
            if (rank(playedCard) === 'J') player.doubleSweeps++;
            else player.sweeps++;
        }
    } else {
        game.pile.push({ card: playedCard, seat: player.seat });
    }

    advanceTurn(game);
    return null;
}

function advanceTurn(game: KseriGame): void {
    const allHandsEmpty = game.players.every(p => p.hand.length === 0);

    if (allHandsEmpty) {
        if (game.deck.length > 0) {
            dealRound(game, game.deck);
        } else {
            endDeal(game);
            return;
        }
    }

    game.turnSeat = (game.turnSeat + 1) % game.players.length;
}

function endDeal(game: KseriGame): void {
    if (game.lastCapturerSeat !== null && game.pile.length > 0) {
        const lastCapturer = game.players.find(p => p.seat === game.lastCapturerSeat)!;
        lastCapturer.captured.push(...game.pile.map(p => p.card));
        game.pile = [];
    }

    scoreDeal(game);
    game.phase = game.dealNumber >= MATCH_DEALS ? 'match-over' : 'deal-over';
}

function scoreDeal(game: KseriGame): void {
    const teamCards: [string[], string[]] = [[], []];
    const teamSweeps: [number, number] = [0, 0];
    const teamDoubleSweeps: [number, number] = [0, 0];

    for (const p of game.players) {
        const t = teamOf(p.seat);
        teamCards[t].push(...p.captured);
        teamSweeps[t] += p.sweeps;
        teamDoubleSweeps[t] += p.doubleSweeps;
    }

    const deal: [number, number] = [0, 0];

    if (teamCards[0].length !== teamCards[1].length) {
        deal[teamCards[0].length > teamCards[1].length ? 0 : 1] += 3;
    }

    for (const t of [0, 1] as const) {
        if (teamCards[t].includes('clubs-2')) deal[t] += 1;
        if (teamCards[t].includes('diamonds-10')) deal[t] += 1;
        deal[t] += teamCards[t].filter(c => BIG_RANKS.has(rank(c))).length;
        deal[t] += teamSweeps[t] * 10 + teamDoubleSweeps[t] * 20;
    }

    game.teamScores[0] += deal[0];
    game.teamScores[1] += deal[1];
    game.dealMessage = `Deal ${game.dealNumber} of ${MATCH_DEALS}: Team A +${deal[0]}, Team B +${deal[1]}`;
}

function pileToTable(game: KseriGame, pile: PileEntry[]) {
    return pile.map(p => ({
        card: p.card,
        playerId: p.seat === undefined ? undefined : game.players.find(pl => pl.seat === p.seat)?.id,
    }));
}

export function getStateFor(game: KseriGame, playerId: string) {
    const activeSeat = game.phase === 'playing' ? game.turnSeat : -1;

    return {
        myId: playerId,
        players: game.players.map(p => ({
            id: p.id,
            name: p.name,
            seat: p.seat,
            hand: p.id === playerId ? sortHand(p.hand) : undefined,
            handCount: p.hand.length,
            isActive: p.seat === activeSeat,
            status: game.phase !== 'waiting'
                ? `Team ${teamOf(p.seat) === 0 ? 'A' : 'B'} · ${game.teamScores[teamOf(p.seat)]} pts`
                : undefined,
        })),
        table: pileToTable(game, game.pile),
        actions: buildActions(game, playerId),
        phase: game.phase,
        message: buildMessage(game, playerId),
    };
}

function buildActions(game: KseriGame, playerId: string) {
    if (game.phase !== 'playing') return [];
    const player = game.players.find(p => p.id === playerId);
    if (player?.seat !== game.turnSeat) return [];
    return [{ type: 'play', label: 'Play', requiresSelection: true, selectCount: 1 }];
}

function buildMessage(game: KseriGame, playerId: string): string {
    switch (game.phase) {
        case 'waiting':
            return `Waiting for players… (${game.players.length}/4)`;
        case 'playing': {
            const active = game.players.find(p => p.seat === game.turnSeat);
            if (active?.id === playerId) return 'Your turn';
            return `${active?.name ?? '?'}'s turn`;
        }
        case 'deal-over':
            return game.dealMessage ?? 'Deal over';
        case 'match-over': {
            const [a, b] = game.teamScores;
            return a === b
                ? `Match over — it's a draw! (${a} - ${b})`
                : `Match over — Team ${a > b ? 'A' : 'B'} wins! (${a} - ${b})`;
        }
        default:
            return '';
    }
}
