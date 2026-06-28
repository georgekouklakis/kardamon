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

    $effect(() => {
        transport.onStateUpdate((newState) => {
            const prevGs = gameState;
            gameState = newState;

            if (prevGs) {
                // Trick cleared — reset the display pile
                if (newState.table.length === 0 && prevGs.table.length > 0) {
                    playGroups = [];
                }

                // Opponent appended cards to the trick
                if (newState.table.length > prevGs.table.length) {
                    const prevActive = prevGs.players.find(p => p.isActive);
                    const prefixUnchanged = prevGs.table.every((c, i) => c === newState.table[i]);
                    if (prefixUnchanged && prevActive && prevActive.id !== newState.myId) {
                        const newCards = newState.table.slice(prevGs.table.length);
                        const oppIdx = opponents.findIndex(o => o.id === prevActive.id);
                        const rotation = SLOT_ROTATION[slots[oppIdx]] ?? 0;
                        playGroups = [...playGroups, { cards: newCards, rotation }];
                        triggerOpponentAnimation(prevActive.id, newCards, playGroups.length - 1);
                    }
                }
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
    let flyingCards: FlyingCard[] = $state([]);
    let hiddenCards: Set<CardId> = $state(new Set());
    interface PlayGroup {
        cards: CardId[];
        rotation: number;
    }

    // Subtle tilt per table slot so played cards look like they arrived from that direction.
    const SLOT_ROTATION: Record<string, number> = {
        north:          3,
        'north-west':   7,
        'north-east':  -7,
        west:          12,
        east:         -12,
        south:         -3,
    };

    // playGroups drives the TableArea display: each entry is one player's play,
    // rendered as a cascade group stacked on top of previous groups.
    let playGroups: PlayGroup[] = $state([]);
    // Which play group is currently hidden while its flying clone is in flight.
    let hiddenGroups: Set<number> = $state(new Set());

    // Returns the viewport rects of all .table-card-slot elements inside a specific
    // .play-group. Called after tick() so the group is in the DOM even if hidden.
    function getPlayGroupRects(groupIndex: number): DOMRect[] {
        if (!tableSlotEl) return [];
        const groups = tableSlotEl.querySelectorAll('.play-group');
        const group = groups[groupIndex];
        if (!group) return [];
        return Array.from(group.querySelectorAll('.table-card-slot'))
            .map(el => (el as HTMLElement).getBoundingClientRect());
    }

    async function runFlyAnimation(sourceRects: DOMRect[], cardIds: CardId[], groupIndex: number) {
        const endRects = getPlayGroupRects(groupIndex);

        const rotation = playGroups[groupIndex]?.rotation ?? 0;

        flyingCards = cardIds.map((cardId, i) => {
            const sr = sourceRects[i] ?? sourceRects[0];
            const er = endRects[i] ?? endRects[endRects.length - 1];
            // Use bbox centres for both source and destination.
            // getBoundingClientRect() returns the axis-aligned bbox of the (possibly
            // rotated) element, so .left/.top are bbox extremes, not the card corner.
            // Rotation doesn't move the centre, so centering the clone on the bbox
            // centre gives a pixel-perfect match when the real card is revealed.
            const scx = sr.left + sr.width  / 2;
            const scy = sr.top  + sr.height / 2;
            const ecx = er ? er.left + er.width  / 2 : scx;
            const ecy = er ? er.top  + er.height / 2 : scy;
            return {
                cardId,
                sx: scx - CARD_W / 2,
                sy: scy - CARD_H / 2,
                ex: ecx - CARD_W / 2,
                ey: ecy - CARD_H / 2,
                rotation,
                active: false,
            };
        });

        await new Promise<void>(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    flyingCards = flyingCards.map(c => ({ ...c, active: true }));
                    setTimeout(resolve, ANIM_MS + 20);
                });
            });
        });

        flyingCards = [];
        hiddenGroups = new Set();
        hiddenCards = new Set();
    }

    async function triggerOpponentAnimation(playerId: string, newCards: CardId[], groupIndex: number) {
        const idx = opponents.findIndex(o => o.id === playerId);
        const fromEl = opponentSlotEls[idx];
        if (!fromEl || !tableSlotEl) return;

        hiddenGroups = new Set([groupIndex]);
        await tick();

        const from = fromEl.getBoundingClientRect();
        const sourceRects = newCards.map(() => from);
        await runFlyAnimation(sourceRects, newCards, groupIndex);
    }

    async function handleSubmit(type: string, cards: CardId[], rects: DOMRect[]) {
        if (type !== 'play' || cards.length === 0 || !tableSlotEl) {
            await transport.submitAction({ type, cards });
            return;
        }

        // Pre-add our play group so the hidden slot is in the DOM before tick().
        playGroups = [...playGroups, { cards, rotation: SLOT_ROTATION['south'] ?? 0 }];
        const groupIndex = playGroups.length - 1;

        hiddenCards = new Set(cards);
        hiddenGroups = new Set([groupIndex]);

        transport.submitAction({ type, cards }).catch(() => {});
        await tick();

        await runFlyAnimation(rects, cards, groupIndex);
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
            <TableArea {playGroups} message={gameState.message} {hiddenGroups} />
        </div>

        <div class="slot south-slot" style="grid-area: south">
            <Hand
                cards={me.hand ?? []}
                actions={gameState.actions}
                hiddenCards={hiddenCards}
                onsubmit={handleSubmit}
            />
        </div>
    {:else}
        <p class="connecting">Connecting to game…</p>
    {/if}

    {#each flyingCards as flying (flying.cardId)}
        <div
            class="flying-card"
            class:animating={flying.active}
            style="--sx: {flying.sx}px; --sy: {flying.sy}px; --ex: {flying.ex}px; --ey: {flying.ey}px; --er: {flying.rotation}deg"
            aria-hidden="true"
        >
            <Card cardId={flying.cardId} interactive={false} />
        </div>
    {/each}
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
