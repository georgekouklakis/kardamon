<script lang="ts">
    import type { CardId, Action } from '../types/protocol';
    import Card from './Card.svelte';

    interface Props {
        cards: CardId[];
        actions: Action[];
        hiddenCards?: Set<CardId>;
        onsubmit?: (type: string, cards: CardId[], rects: DOMRect[]) => void;
    }

    let { cards, actions, hiddenCards = new Set(), onsubmit }: Props = $props();

    let selected = $state(new Set<CardId>());
    // Refs to .card-arc divs — getBoundingClientRect() on these gives the actual
    // viewport position of each visually-rotated card (not the un-rotated slot).
    let cardArcRefs: HTMLElement[] = [];

    // Only the cards that are both selected AND still in hand. This replaces the
    // old $effect that cleared the whole selection on every cards reference change
    // (which fired on every opponent-turn state update, not just when my cards changed).
    const validSelected = $derived(new Set(cards.filter(c => selected.has(c))));

    function fanAngle(index: number, total: number): number {
        if (total <= 1) return 0;
        // Total arc grows with card count, capped at 60°
        const span = Math.min(60, total * 6);
        return ((index - (total - 1) / 2) / (total - 1)) * span;
    }

    function toggleCard(cardId: CardId) {
        const next = new Set(selected);
        if (next.has(cardId)) {
            next.delete(cardId);
        } else {
            next.add(cardId);
        }
        selected = next;
    }

    function handleAction(action: Action) {
        // cards.filter preserves left-to-right hand order, not the order cards were clicked.
        const cardIds = action.requiresSelection ? cards.filter(id => validSelected.has(id)) : [];

        // Capture viewport positions before anything changes.
        const rects = cardIds.map(id => {
            const i = cards.indexOf(id);
            return cardArcRefs[i]?.getBoundingClientRect() ?? new DOMRect();
        });

        onsubmit?.(action.type, cardIds, rects);
        selected = new Set();
    }
</script>

<section class="hand-area" aria-label="Your hand">
    <div
        class="hand"
        role="group"
        aria-label="{cards.length} card{cards.length !== 1 ? 's' : ''} in hand"
    >
        {#each cards as cardId, i}
            {@const angle = fanAngle(i, cards.length)}
            <!--
                Two-wrapper pattern:
                .card-slot  → screen-space lift (translateY, straight up)
                .card-arc   → fan rotation around shared pivot below
                This keeps the lift direction perpendicular to the ground
                regardless of how much the card is rotated in the fan.
            -->
            <div
                class="card-slot"
                class:lifted={validSelected.has(cardId)}
                class:hidden={hiddenCards.has(cardId)}
                style="--z: {i + 1}"
            >
                <div class="card-arc" style="--angle: {angle}deg" bind:this={cardArcRefs[i]}>
                    <Card
                        {cardId}
                        selected={validSelected.has(cardId)}
                        onselect={() => toggleCard(cardId)}
                    />
                </div>
            </div>
        {/each}
    </div>

    {#if actions.length > 0}
        <div class="actions" role="group" aria-label="Turn actions">
            {#each actions as action}
                <button
                    class="btn"
                    class:btn-primary={action.requiresSelection}
                    class:btn-secondary={!action.requiresSelection}
                    disabled={action.requiresSelection && validSelected.size === 0}
                    onclick={() => handleAction(action)}
                    aria-label={action.requiresSelection
                        ? `${action.label} ${validSelected.size} selected card${validSelected.size !== 1 ? 's' : ''}`
                        : action.label}
                >
                    {action.label}{action.requiresSelection ? ` (${validSelected.size})` : ''}
                </button>
            {/each}
        </div>
    {:else}
        <p class="waiting" aria-live="polite">Waiting for other players…</p>
    {/if}
</section>

<style>
    .hand-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .hand {
        position: relative;
        height: 200px;
        width: 100%;
        overflow: visible;
    }

    /*
     * .card-slot: positioned at the shared arc origin (horizontal center, bottom).
     * Handles z-index, the vertical lift on selection, and the hidden state.
     * Its transform is purely vertical so the lift is always straight up in screen
     * space, independent of the arc angle applied by .card-arc below.
     *
     * pointer-events: none is critical here. All .card-slot wrappers occupy the same
     * pixel position (left: 50%, bottom: 0), so without this, the highest-z-index
     * wrapper would swallow clicks meant for cards at adjacent visual positions.
     * Pointer events are re-enabled on .card-arc so only the rotated visual card is
     * clickable, which is exactly the area the user sees.
     */
    .card-slot {
        position: absolute;
        left: 50%;
        bottom: 0;
        margin-left: -36px;
        pointer-events: none;
        transform: translateY(0);
        /* opacity intentionally not transitioned: instant hide keeps flying-card
           clone as the sole visible object during play animation */
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        z-index: var(--z);
    }

    /* Keyboard focus brings the card on top so it's fully visible while navigating.
       Hover deliberately excluded: the card's own box-shadow highlight is enough,
       and boosting z-index on hover pushes hovered cards over their neighbours. */
    .card-slot:has(:focus-visible) {
        z-index: 100;
    }

    .card-slot.lifted {
        transform: translateY(-32px);
        /* no z-index change: card moves forward in space but stays in its natural
           stacking position within the fan — selected cards don't leap over neighbours */
    }

    .card-slot.hidden {
        opacity: 0;
    }

    /*
     * .card-arc: rotates the card around a pivot 200px below the card's bottom edge.
     * All cards share the same pivot point (center-bottom of the hand area, 200px further
     * down), so they form a true arc rather than each rotating around their own center.
     *
     * transform-origin: 36px = horizontal center of card (72px / 2)
     *                   308px = card height (108px) + pivot distance (200px)
     */
    .card-arc {
        pointer-events: auto;
        transform-origin: 36px 308px;
        transform: rotate(var(--angle));
    }

    .actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    .btn {
        padding: 0.6rem 1.75rem;
        border-radius: 6px;
        border: none;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition:
            background 0.15s ease,
            opacity 0.15s ease,
            transform 0.1s ease;
    }

    .btn:active:not(:disabled) {
        transform: scale(0.97);
    }

    .btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .btn:focus-visible {
        outline: 3px solid #0066cc;
        outline-offset: 2px;
    }

    .btn-primary {
        background: #0066cc;
        color: white;
    }

    .btn-primary:not(:disabled):hover {
        background: #0052a3;
    }

    .btn-secondary {
        background: #e5e7eb;
        color: #374151;
    }

    .btn-secondary:hover {
        background: #d1d5db;
    }

    .waiting {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.875rem;
        margin: 0;
    }
</style>
