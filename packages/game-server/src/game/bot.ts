import { suit, rank, rankValue, cardPoints } from './deck.js';
import { currentActiveSeat, validatePlay } from './hearts.js';
import type { HeartsGame, GamePlayer } from './types.js';

export function getBotPass(player: GamePlayer): string[] {
    const hand = [...player.hand];
    const toPass: string[] = [];

    // Offload Q♠ — worst card to hold
    const queenSpades = hand.find(c => c === 'spades-Q');
    if (queenSpades) toPass.push(queenSpades);

    // Offload high spades that risk being stuck with Q♠-adjacent danger
    if (toPass.length < 3) {
        const highSpades = hand
            .filter(c => suit(c) === 'spades' && ['K', 'A'].includes(rank(c)) && !toPass.includes(c))
            .sort((a, b) => rankValue(b) - rankValue(a));
        for (const c of highSpades) {
            if (toPass.length < 3) toPass.push(c);
        }
    }

    // Offload high hearts
    if (toPass.length < 3) {
        const highHearts = hand
            .filter(c => suit(c) === 'hearts' && !toPass.includes(c))
            .sort((a, b) => rankValue(b) - rankValue(a));
        for (const c of highHearts) {
            if (toPass.length < 3) toPass.push(c);
        }
    }

    // Fill with highest remaining cards
    if (toPass.length < 3) {
        const rest = hand
            .filter(c => !toPass.includes(c))
            .sort((a, b) => rankValue(b) - rankValue(a));
        for (const c of rest) {
            if (toPass.length < 3) toPass.push(c);
        }
    }

    return toPass.slice(0, 3);
}

export function getBotPlay(game: HeartsGame, playerId: string): string | null {
    const player = game.players.find(p => p.id === playerId);
    if (!player || player.seat !== currentActiveSeat(game)) return null;

    const valid = player.hand.filter(c => validatePlay(game, playerId, c) === null);
    if (valid.length === 0) return player.hand[0] ?? null;

    const isLeading = game.currentTrick.length === 0;

    if (isLeading) {
        // Lead lowest safe card; avoid hearts unless broken
        const safe = valid.filter(c => suit(c) !== 'hearts' && c !== 'spades-Q');
        const pool = safe.length > 0 ? safe : valid;
        return pool.sort((a, b) => rankValue(a) - rankValue(b))[0] ?? null;
    }

    const ledSuit = suit(game.currentTrick[0]!.card);
    const following = valid.filter(c => suit(c) === ledSuit);

    if (following.length > 0) {
        // Try to lose the trick: play highest card that still loses
        const currentWinner = [...game.currentTrick]
            .filter(e => suit(e.card) === ledSuit)
            .sort((a, b) => rankValue(b) - rankValue(a))[0];

        const losing = following.filter(
            c => rankValue(c) < rankValue(currentWinner?.card ?? '')
        );

        if (losing.length > 0) {
            // Highest losing card (minimize future losing plays)
            return losing.sort((a, b) => rankValue(b) - rankValue(a))[0] ?? null;
        }
        // Forced to win — play lowest winner to preserve high cards
        return following.sort((a, b) => rankValue(a) - rankValue(b))[0] ?? null;
    }

    // Discarding — dump the most dangerous cards first
    const queenSpades = valid.find(c => c === 'spades-Q');
    if (queenSpades) return queenSpades;

    const hearts = valid.filter(c => suit(c) === 'hearts');
    if (hearts.length > 0) {
        return hearts.sort((a, b) => rankValue(b) - rankValue(a))[0] ?? null;
    }

    return valid.sort((a, b) => rankValue(b) - rankValue(a))[0] ?? null;
}
