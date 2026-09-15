<script lang="ts">
    import { tick } from 'svelte';
    import type { Transport } from '../transport/transport';
    import type { GameState, Player, CardId } from '../types/protocol';
    import Hand from './Hand.svelte';
    import OpponentArea from './OpponentArea.svelte';
    import TableArea from './TableArea.svelte';
    import Card from './Card.svelte';

    interface Props {
        transport: Transport;
    }

    let { transport }: Props = $props();

    let gameState = $state<GameState | null>(null);
    let announcement = $state('');

    const OPPONENT_SLOTS: Record<number, string[]> = {
        1: ['north'],
        2: ['north-west', 'north-east'],
        3: ['west', 'north', 'east'],
        4: ['west', 'north-west', 'north-east', 'east'],
    };

    const me = $derived(gameState?.players.find(p => p.id === gameState!.myId));

    const opponents = $derived(
        !gameState || !me
            ? []
            : Array.from({ length: gameState.players.length - 1 }, (_, i) => {
                  const seat = (me.seat + i + 1) % gameState!.players.length;
                  return gameState!.players.find(p => p.seat === seat);
              }).filter((p): p is Player => p !== undefined)
    );

    const slots = $derived(OPPONENT_SLOTS[opponents.length] ?? OPPONENT_SLOTS[3]);

    // Subtle tilt per table slot so played cards look like they arrived from that direction.
    const SLOT_ROTATION: Record<string, number> = {
        north:          3,
        'north-west':   7,
        'north-east':  -7,
        west:          12,
        east:         -12,
        south:         -3,
    };

    // The only game knowledge here is "which direction is this player's seat in
    // relation to me" — purely a layout fact from `players`/`opponents`, not a rule
    // of any specific game. Cards with no playerId (e.g. a game's initial face-up
    // deal) get no directional tilt.
    function rotationFor(playerId: string | undefined): number {
        if (!playerId || !gameState) return 0;
        if (playerId === gameState.myId) return SLOT_ROTATION['south'] ?? 0;
        const idx = opponents.findIndex(o => o.id === playerId);
        return idx >= 0 ? (SLOT_ROTATION[slots[idx]] ?? 0) : 0;
    }

    $effect(() => {
        transport.onActionError((message) => {
            // The server rejected our last play — it never left our hand, and since it
            // was never speculatively added to the table (see handleSubmit below),
            // there's nothing to roll back beyond un-hiding it.
            if (pendingPlay) {
                const cards = pendingPlay.cards;
                hiddenCards = new Set([...hiddenCards].filter(c => !cards.includes(c)));
                pendingPlay = null;
                playInFlight = false;
            }
            announcement = message;
        });

        transport.onStateUpdate((newState) => {
            const prevGs = gameState;
            gameState = newState;

            // TableArea renders `table` directly — there's nothing to reconstruct or
            // reset here. The diffing below exists purely to decide whether a newly
            // appeared table card should fly in from somewhere (and from where).
            let ownPlayAnimated = false;

            if (prevGs && newState.table.length > prevGs.table.length) {
                const prefixUnchanged = prevGs.table.every((e, i) => e.card === newState.table[i]?.card);
                if (prefixUnchanged) {
                    for (const entry of newState.table.slice(prevGs.table.length)) {
                        if (pendingPlay && entry.playerId === newState.myId) {
                            const rects = pendingPlay.rects;
                            pendingPlay = null;
                            ownPlayAnimated = true;
                            animateOwnPlay(entry.card, rects);
                        } else if (entry.playerId && entry.playerId !== newState.myId) {
                            animateOpponentPlay(entry.card, entry.playerId);
                        }
                        // else: a dealt (unattributed) card — just appears, no animation.
                    }
                }
            }

            // Our own play resolved but didn't land on the table as a new entry above
            // — e.g. it was immediately captured/consumed rather than placed. Nothing
            // to animate; just clear the pending/hidden state so the hand reflects
            // the confirmed truth.
            if (pendingPlay && !ownPlayAnimated) {
                pendingPlay = null;
                playInFlight = false;
                hiddenCards = new Set();
            }

            const active = newState.players.find(p => p.isActive);
            announcement = active?.id === newState.myId
                ? 'Your turn'
                : active
                  ? `${active.name}'s turn`
                  : '';
        });
        transport.connect();
        return () => transport.disconnect();
    });

    // ─── Flying card animation ────────────────────────────────────────────────

    interface FlyingCard {
        cardId: CardId;
        sx: number; sy: number;
        ex: number; ey: number;
        rotation: number; // end rotation in degrees; animates from 0 during flight
        active: boolean;
    }

    const CARD_W = 72;
    const CARD_H = 108;
    const ANIM_MS = 380;

    let tableSlotEl: HTMLElement | null = $state(null);
    let opponentSlotEls: HTMLElement[] = [];
    let flyingCard: FlyingCard | null = $state(null);
    let hiddenCards: Set<CardId> = $state(new Set());

    // Our own submitted-but-not-yet-confirmed play. The card is hidden from the hand
    // immediately for responsiveness, but nothing is added to the table until the
    // server confirms it (see onStateUpdate) — never speculatively. That way a
    // rejection just means un-hiding it; there's never a phantom table entry to roll
    // back, and no race with an animation that assumed the play would land.
    let pendingPlay: { cards: CardId[]; rects: DOMRect[] } | null = $state(null);
    // True from the moment a play is submitted until it's confirmed or rejected.
    // Blocks a second play from starting in that window.
    let playInFlight = $state(false);

    function getCardRect(card: CardId): DOMRect | null {
        if (!tableSlotEl) return null;
        const el = tableSlotEl.querySelector(`[data-card="${CSS.escape(card)}"]`);
        return el ? (el as HTMLElement).getBoundingClientRect() : null;
    }

    async function runFlyAnimation(sourceRect: DOMRect, card: CardId) {
        const endRect = getCardRect(card);
        const rotation = rotationFor(gameState?.table.find(e => e.card === card)?.playerId);

        const scx = sourceRect.left + sourceRect.width / 2;
        const scy = sourceRect.top + sourceRect.height / 2;
        const ecx = endRect ? endRect.left + endRect.width / 2 : scx;
        const ecy = endRect ? endRect.top + endRect.height / 2 : scy;

        flyingCard = {
            cardId: card,
            sx: scx - CARD_W / 2,
            sy: scy - CARD_H / 2,
            ex: ecx - CARD_W / 2,
            ey: ecy - CARD_H / 2,
            rotation,
            active: false,
        };

        await new Promise<void>(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (flyingCard) flyingCard = { ...flyingCard, active: true };
                    setTimeout(resolve, ANIM_MS + 20);
                });
            });
        });

        flyingCard = null;
        hiddenCards = new Set();
    }

    async function animateOpponentPlay(card: CardId, playerId: string) {
        const idx = opponents.findIndex(o => o.id === playerId);
        const fromEl = opponentSlotEls[idx];
        if (!fromEl || !tableSlotEl) return;

        hiddenCards = new Set([card]);
        await tick();

        await runFlyAnimation(fromEl.getBoundingClientRect(), card);
    }

    // Server just confirmed our own play landed on the table — the entry was only
    // added a moment ago, so wait for the DOM to catch up before runFlyAnimation
    // measures it (mirrors animateOpponentPlay above).
    async function animateOwnPlay(card: CardId, rects: DOMRect[]) {
        hiddenCards = new Set([card]);
        await tick();
        await runFlyAnimation(rects[0] ?? new DOMRect(), card);
        playInFlight = false;
    }

    async function handleSubmit(type: string, cards: CardId[], rects: DOMRect[]) {
        if (type !== 'play' || cards.length === 0) {
            await transport.submitAction({ type, cards });
            return;
        }

        // Refuse to start a second play while one is still settling — see playInFlight.
        if (playInFlight) return;
        playInFlight = true;

        // Hide the card from the hand immediately for responsiveness, but it isn't
        // added to the table until the server confirms it (see onStateUpdate) — a
        // rejection then just means un-hiding it, nothing to undo on the table.
        pendingPlay = { cards, rects };
        hiddenCards = new Set(cards);

        transport.submitAction({ type, cards }).catch(() => {});
    }
</script>

<main class="game-table layout-{opponents.length}">
    <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
        {announcement}
    </div>

    {#if gameState && me}
        {#each opponents as opponent, i}
            <div class="slot" style="grid-area: {slots[i]}" bind:this={opponentSlotEls[i]}>
                <OpponentArea player={opponent} />
            </div>
        {/each}

        <div class="slot table-slot" style="grid-area: table" bind:this={tableSlotEl}>
            <TableArea table={gameState.table} {rotationFor} {hiddenCards} />
        </div>

        <div class="slot south-slot" style="grid-area: south">
            <Hand
                cards={me.hand ?? []}
                actions={gameState.actions}
                hiddenCards={hiddenCards}
                busy={playInFlight}
                message={gameState.message ?? ''}
                onsubmit={handleSubmit}
            />
        </div>
    {:else}
        <p class="connecting">Connecting to game…</p>
    {/if}

    {#if flyingCard}
        <div
            class="flying-card"
            class:animating={flyingCard.active}
            style="--sx: {flyingCard.sx}px; --sy: {flyingCard.sy}px; --ex: {flyingCard.ex}px; --ey: {flyingCard.ey}px; --er: {flyingCard.rotation}deg"
            aria-hidden="true"
        >
            <Card cardId={flyingCard.cardId} interactive={false} />
        </div>
    {/if}
</main>

<style>
    .game-table {
        height: 100%;
        min-height: 480px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr auto;
        gap: 0.5rem;
        padding: 1rem;
        background: radial-gradient(ellipse at center, #2d6a4f 0%, #1b4332 100%);
    }

    .layout-1 {
        grid-template-areas:
            ". north ."
            ". table ."
            ". south .";
    }

    .layout-2 {
        grid-template-areas:
            "north-west . north-east"
            ". table ."
            ". south .";
    }

    .layout-3 {
        grid-template-areas:
            ". north ."
            "west table east"
            ". south .";
    }

    .layout-4 {
        grid-template-areas:
            "west north-west north-east east"
            "west table table east"
            ". south south .";
        grid-template-columns: auto 1fr 1fr auto;
    }

    .slot {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .south-slot {
        align-items: flex-end;
    }

    .table-slot {
        min-height: 120px;
    }

    .connecting {
        grid-area: table;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
        font-size: 1rem;
    }

    /*
     * .flying-card: fixed overlay clone that travels from source to destination.
     * transition-duration must stay in sync with ANIM_MS in the script above.
     */
    .flying-card {
        position: fixed;
        top: 0;
        left: 0;
        width: 72px;
        height: 108px;
        pointer-events: none;
        z-index: 9999;
        transform: translate(var(--sx), var(--sy)) rotate(0deg);
        will-change: transform;
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
    }

    .flying-card.animating {
        transform: translate(var(--ex), var(--ey)) rotate(var(--er));
        transition: transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
</style>
