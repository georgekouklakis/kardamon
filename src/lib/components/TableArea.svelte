<script lang="ts">
    import type { CardId } from '../types/protocol';
    import Card from './Card.svelte';

    interface PlayGroup {
        cards: CardId[];
        rotation: number; // degrees; reflects the direction the play came from
    }

    interface Props {
        playGroups: PlayGroup[];
        message?: string;
        hiddenGroups?: Set<number>;
    }

    let { playGroups, message, hiddenGroups = new Set() }: Props = $props();

    const totalCards = $derived(playGroups.reduce((n, g) => n + g.cards.length, 0));
</script>

<div class="table-area" role="region" aria-label={totalCards > 0 ? `${totalCards} card${totalCards !== 1 ? 's' : ''} on table` : 'Table is empty'}>
    {#if message}
        <p class="message" aria-live="polite">{message}</p>
    {/if}

    <div class="table-cards">
        {#each playGroups as group, gi}
            <div
                class="play-group"
                class:hidden={hiddenGroups.has(gi)}
                style="--gi: {gi}; --rotation: {group.rotation}deg"
            >
                {#each group.cards as cardId, ci}
                    <div class="table-card-slot" style="--i: {ci}">
                        <Card {cardId} interactive={false} />
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .table-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        height: 100%;
    }

    .message {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.85rem;
        font-style: italic;
        margin: 0;
        text-align: center;
    }

    /* Fixed anchor point; all play-groups are absolutely stacked inside. */
    .table-cards {
        position: relative;
        width: 200px;
        height: 108px;
    }

    /* Each play is stacked directly on top of the previous one.
       left: 50% + translateX(-50%) centres every group at the same horizontal axis
       regardless of how many cards are in that play.
       z-index: var(--gi) ensures the most recent play is always on top. */
    .play-group {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%) rotate(var(--rotation));
        transform-origin: center center;
        display: flex;
        z-index: var(--gi);
    }

    .play-group.hidden {
        opacity: 0;
    }

    /*
     * Classic playing-card cascade: each card is offset 46px left (72px card − 26px peek).
     * 26px exposes the top-left corner pip (5px padding + ~20px rank/suit text) of the
     * card beneath. Later cards have higher z-index so they sit on top, matching
     * the convention that the most-recently-played card is always fully visible.
     */
    .table-card-slot {
        position: relative;
        margin-left: -46px;
        z-index: var(--i);
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.45));
    }

    .table-card-slot:first-child {
        margin-left: 0;
    }
</style>
