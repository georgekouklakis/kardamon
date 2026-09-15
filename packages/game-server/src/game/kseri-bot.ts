import { rank } from './deck.js';
import { validatePlay } from './kseri.js';
import type { KseriGame } from './kseri-types.js';

const BIG_RANKS = new Set(['A', 'K', 'Q', 'J', '10']);

function cardWeight(card: string): number {
    return BIG_RANKS.has(rank(card)) ? 3 : 1;
}

export function getBotPlay(game: KseriGame, playerId: string): string | null {
    const player = game.players.find(p => p.id === playerId);
    if (!player || player.seat !== game.turnSeat) return null;

    const legal = player.hand.filter(c => validatePlay(game, playerId, c) === null);
    if (legal.length === 0) return null;

    const pileTop = game.pile[game.pile.length - 1];

    if (pileTop) {
        const isLone = game.pile.length === 1;
        const topIsJack = rank(pileTop.card) === 'J';

        // A lone Jack on the pile: capturing it with a Jack is the 20-point double
        // xeri — always worth taking.
        if (isLone && topIsJack) {
            const jack = legal.find(c => rank(c) === 'J');
            if (jack) return jack;
        }

        // Rank-matching the top card captures the whole pile; on a lone (non-Jack)
        // pile this is a 10-point xeri, always worth taking with the cheapest match.
        const rankMatches = legal.filter(c => rank(c) === rank(pileTop.card));
        if (rankMatches.length > 0) {
            return rankMatches.sort((a, b) => cardWeight(a) - cardWeight(b))[0]!;
        }

        // No rank match, but a Jack can still wildcard-capture the whole pile. Worth
        // it once the pile has built up some value; wasteful on a lone non-Jack card
        // (captures 1 card for the price of a Jack, and forfeits any xeri bonus).
        const jack = legal.find(c => rank(c) === 'J');
        if (jack && game.pile.length > 1) return jack;
    }

    // Nothing worth capturing with — place the least valuable card, saving Jacks and
    // big cards for later (a big card left on top just feeds the next player).
    return [...legal].sort((a, b) => cardWeight(a) - cardWeight(b))[0]!;
}
