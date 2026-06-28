import { dealDeck, suit, rankValue, cardPoints } from './deck.js';
import type { HeartsGame, GamePlayer, PassDirection, TrickEntry } from './types.js';

const PASS_DIRECTIONS: PassDirection[] = ['left', 'right', 'across', 'hold'];

export function createGame(id: string): HeartsGame {
    return {
        id,
        phase: 'waiting',
        players: [],
        passDirection: 'left',
        roundNumber: 0,
        trickNumber: 0,
        heartsBroken: false,
        currentTrick: [],
        trickLeaderSeat: 0,
    };
}

export function addPlayer(game: HeartsGame, id: string, name: string, isBot = false): void {
    if (game.players.length >= 4) throw new Error('Room is full');
    game.players.push({
        id, name, isBot,
        seat: game.players.length,
        hand: [],
        pendingPass: null,
        score: 0,
        roundPoints: 0,
        trickCards: [],
    });
}

export function startRound(game: HeartsGame): void {
    const hands = dealDeck();
    game.players.forEach((p, i) => {
        p.hand = hands[i] ?? [];
        p.pendingPass = null;
        p.roundPoints = 0;
        p.trickCards = [];
    });
    game.heartsBroken = false;
    game.currentTrick = [];
    game.trickNumber = 0;
    game.roundNumber++;

    if (game.passDirection === 'hold') {
        beginPlaying(game);
    } else {
        game.phase = 'passing';
    }
}

function passTarget(seat: number, direction: PassDirection): number {
    switch (direction) {
        case 'left':   return (seat + 1) % 4;
        case 'right':  return (seat + 3) % 4;
        case 'across': return (seat + 2) % 4;
        case 'hold':   return seat;
    }
}

export function submitPass(game: HeartsGame, playerId: string, cards: string[]): string | null {
    if (game.phase !== 'passing') return 'Not in passing phase';
    const player = game.players.find(p => p.id === playerId);
    if (!player) return 'Player not found';
    if (player.pendingPass !== null) return 'Already submitted pass';
    if (cards.length !== 3) return 'Must pass exactly 3 cards';
    if (!cards.every(c => player.hand.includes(c))) return 'Card not in hand';

    player.pendingPass = cards;

    if (game.players.every(p => p.pendingPass !== null)) {
        executePass(game);
    }
    return null;
}

function executePass(game: HeartsGame): void {
    const transfers = game.players.map(p => ({
        from: p.seat,
        to: passTarget(p.seat, game.passDirection),
        cards: p.pendingPass!,
    }));

    // Remove cards from senders first, then give to recipients
    transfers.forEach(({ from, cards }) => {
        const fromPlayer = game.players.find(p => p.seat === from)!;
        fromPlayer.hand = fromPlayer.hand.filter(c => !cards.includes(c));
        fromPlayer.pendingPass = null;
    });
    transfers.forEach(({ to, cards }) => {
        const toPlayer = game.players.find(p => p.seat === to)!;
        toPlayer.hand.push(...cards);
    });

    beginPlaying(game);
}

function beginPlaying(game: HeartsGame): void {
    game.phase = 'playing';
    game.currentTrick = [];
    // Whoever holds 2♣ leads
    const leader = game.players.find(p => p.hand.includes('clubs-2'));
    game.trickLeaderSeat = leader?.seat ?? 0;
}

export function currentActiveSeat(game: HeartsGame): number {
    return (game.trickLeaderSeat + game.currentTrick.length) % 4;
}

export function validatePlay(game: HeartsGame, playerId: string, card: string): string | null {
    if (game.phase !== 'playing') return 'Not in playing phase';
    const player = game.players.find(p => p.id === playerId);
    if (!player) return 'Player not found';
    if (player.seat !== currentActiveSeat(game)) return 'Not your turn';
    if (!player.hand.includes(card)) return 'Card not in hand';

    const isLeading = game.currentTrick.length === 0;
    const ledSuit = isLeading ? null : suit(game.currentTrick[0]!.card);

    if (isLeading) {
        // First trick: must lead the 2♣
        if (game.trickNumber === 0 && card !== 'clubs-2') {
            return 'Must lead 2♣ to start';
        }
        // Can't lead hearts until broken (unless hand is all hearts)
        if (suit(card) === 'hearts' && !game.heartsBroken) {
            const hasNonHearts = player.hand.some(c => suit(c) !== 'hearts');
            if (hasNonHearts) return 'Hearts not broken yet';
        }
    } else {
        // Must follow led suit if possible
        if (ledSuit && suit(card) !== ledSuit) {
            if (player.hand.some(c => suit(c) === ledSuit)) {
                return `Must follow ${ledSuit}`;
            }
        }
        // First trick: no penalty cards unless nothing else to play
        if (game.trickNumber === 0 && cardPoints(card) > 0) {
            const hasAlternative = player.hand.some(c => c !== card && cardPoints(c) === 0);
            if (hasAlternative) return 'No penalty cards on first trick';
        }
    }

    return null;
}

export function playCard(game: HeartsGame, playerId: string, card: string): string | null {
    const err = validatePlay(game, playerId, card);
    if (err) return err;

    const player = game.players.find(p => p.id === playerId)!;
    player.hand = player.hand.filter(c => c !== card);
    game.currentTrick.push({ seat: player.seat, card });

    if (suit(card) === 'hearts') game.heartsBroken = true;

    return null;
}

export function trickComplete(game: HeartsGame): boolean {
    return game.currentTrick.length === game.players.length;
}

export function settleTrick(game: HeartsGame): void {
    if (!trickComplete(game)) return;

    const trick = game.currentTrick as TrickEntry[];
    const ledSuit = suit(trick[0]!.card);

    let winner = trick[0]!;
    for (const entry of trick.slice(1)) {
        if (suit(entry.card) === ledSuit && rankValue(entry.card) > rankValue(winner.card)) {
            winner = entry;
        }
    }

    const winnerPlayer = game.players.find(p => p.seat === winner.seat)!;
    winnerPlayer.trickCards.push(...trick.map(e => e.card));

    game.trickNumber++;
    game.currentTrick = [];
    game.trickLeaderSeat = winner.seat;

    if (game.trickNumber === 13) finishRound(game);
}

function finishRound(game: HeartsGame): void {
    game.players.forEach(p => {
        p.roundPoints = p.trickCards.reduce((sum, c) => sum + cardPoints(c), 0);
    });

    // Shoot the moon: one player collected all 26 points
    const shooter = game.players.find(p => p.roundPoints === 26);
    if (shooter) {
        game.players.forEach(p => {
            p.roundPoints = p === shooter ? 0 : 26;
        });
    }

    game.players.forEach(p => { p.score += p.roundPoints; });

    if (game.players.some(p => p.score >= 100)) {
        game.phase = 'game-over';
    } else {
        game.phase = 'round-over';
        const idx = PASS_DIRECTIONS.indexOf(game.passDirection);
        game.passDirection = PASS_DIRECTIONS[(idx + 1) % 4]!;
    }
}

export function getStateFor(game: HeartsGame, playerId: string) {
    const activeSeat = game.phase === 'playing' ? currentActiveSeat(game) : -1;

    return {
        myId: playerId,
        players: game.players.map(p => ({
            id: p.id,
            name: p.name,
            seat: p.seat,
            hand: p.id === playerId ? p.hand : undefined,
            handCount: p.hand.length,
            isActive: p.seat === activeSeat,
            status: (game.phase !== 'waiting' && game.phase !== 'passing')
                ? `${p.score} pts`
                : undefined,
        })),
        table: game.currentTrick.map(e => e.card),
        actions: buildActions(game, playerId),
        phase: game.phase,
        message: buildMessage(game, playerId),
    };
}

function buildActions(game: HeartsGame, playerId: string) {
    if (game.phase === 'passing') {
        const player = game.players.find(p => p.id === playerId);
        if (player?.pendingPass === null) {
            const label = {
                left:   'Pass left →',
                right:  '← Pass right',
                across: 'Pass across ↑',
                hold:   'Keep cards',
            }[game.passDirection];
            return [{ type: 'pass', label, requiresSelection: true }];
        }
    }
    if (game.phase === 'playing') {
        const player = game.players.find(p => p.id === playerId);
        if (player?.seat === currentActiveSeat(game)) {
            return [{ type: 'play', label: 'Play', requiresSelection: true }];
        }
    }
    return [];
}

function buildMessage(game: HeartsGame, playerId: string): string {
    switch (game.phase) {
        case 'waiting':
            return `Waiting for players… (${game.players.length}/4)`;
        case 'passing': {
            const player = game.players.find(p => p.id === playerId);
            if (player?.pendingPass !== null) return 'Waiting for others to pass…';
            return `Select 3 cards to pass ${game.passDirection}`;
        }
        case 'playing': {
            const activeSeat = currentActiveSeat(game);
            const active = game.players.find(p => p.seat === activeSeat);
            if (active?.id === playerId) return 'Your turn';
            return `${active?.name ?? '?'}'s turn`;
        }
        case 'round-over': {
            const scores = game.players
                .map(p => `${p.name}: +${p.roundPoints}`)
                .join(' · ');
            const shooter = game.players.find(p => p.roundPoints === 0 &&
                game.players.some(other => other !== p && other.roundPoints === 26));
            return shooter
                ? `${shooter.name} shot the moon! — ${scores}`
                : `Round over — ${scores}`;
        }
        case 'game-over': {
            const winner = [...game.players].sort((a, b) => a.score - b.score)[0]!;
            return `Game over! ${winner.name} wins with ${winner.score} pts`;
        }
    }
}
