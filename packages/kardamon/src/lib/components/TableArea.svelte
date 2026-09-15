<script lang="ts">
    import type { CardId, TablePlay } from '../types/protocol';
    import Card from './Card.svelte';

    interface Props {
        table: TablePlay[];
        rotationFor: (playerId: string | undefined) => number;
        hiddenCards?: Set<CardId>;
    }

    let { table, rotationFor, hiddenCards = new Set() }: Props = $props();
</script>

<div
    class="table-area"
    role="region"
    aria-label={table.length > 0 ? `${table.length} card${table.length !== 1 ? 's' : ''} on the table` : 'Table is empty'}
>
    <div class="table-cards">
        {#each table as entry, i (entry.card)}
            <div
                class="table-card-slot"
                class:hidden={hiddenCards.has(entry.card)}
                style="--i: {i}"
                data-card={entry.card}
            >
                <div class="table-card-inner" style="--rotation: {rotationFor(entry.playerId)}deg">
                    <Card cardId={entry.card} interactive={false} />
                </div>
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
        width: 100%;
    }

    /* Every played/dealt card is rendered flat in table order — no per-trick or
       per-game grouping. Cascade: each subsequent card overlaps the previous one,
       leaving a 26px corner peek (72px card - 46px overlap); later cards (higher
       index) sit on top via z-index. Centered as a whole via flex justify-content. */
    .table-cards {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        min-height: 108px;
        row-gap: 0.5rem;
    }

    .table-card-slot {
        position: relative;
        margin-left: -46px;
        z-index: var(--i);
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.45));
    }

    .table-card-slot:first-child {
        margin-left: 0;
    }

    .table-card-slot.hidden {
        opacity: 0;
    }

    /* Rotation lives on an inner wrapper so it doesn't fight with the slot's own
       cascade positioning (which uses normal flex flow + margin, not transform). */
    .table-card-inner {
        transform: rotate(var(--rotation));
    }
</style>
