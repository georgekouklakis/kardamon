<script lang="ts">
    import { getContext } from 'svelte';
    import type { Player, CardSheet } from '../types/protocol';

    interface Props {
        player: Player;
    }

    let { player }: Props = $props();

    const getSheet = getContext<(() => CardSheet | undefined) | undefined>('kardamon:cardSheet');
    const cardSheet = $derived(getSheet?.());
    const backFrame = $derived(cardSheet?.cards['back']);

    // CSS background values for the back sprite, scaled to the 40×60 back size.
    const backSpriteStyle = $derived((): string | undefined => {
        if (!cardSheet || !backFrame) return undefined;
        const scaleX = 40 / cardSheet.cardSize.w;
        const scaleY = 60 / cardSheet.cardSize.h;
        return [
            `background-image: url("${cardSheet.image}")`,
            `background-size: ${cardSheet.totalSize.w * scaleX}px ${cardSheet.totalSize.h * scaleY}px`,
            `background-position: ${-backFrame.x * scaleX}px ${-backFrame.y * scaleY}px`,
        ].join('; ');
    });

    const backs = $derived(Math.min(player.handCount, 5));
</script>

<div
    class="opponent"
    class:active={player.isActive}
    aria-label="{player.name}, {player.handCount} card{player.handCount !== 1 ? 's' : ''}{player.isActive ? ', their turn' : ''}"
>
    <div class="name" aria-hidden="true">{player.name}</div>

    {#if player.status}
        <div class="status" aria-hidden="true">{player.status}</div>
    {/if}

    <div class="card-backs" aria-hidden="true">
        {#each Array.from({ length: backs }) as _, i}
            <div
                class="card-back"
                class:sprite={!!backFrame}
                style="--i: {i}; {backSpriteStyle() ?? ''}"
            ></div>
        {/each}
        {#if player.handCount === 0}
            <div class="empty-hand">–</div>
        {/if}
    </div>

    <div class="card-count" aria-hidden="true">{player.handCount}</div>
</div>

<style>
    .opponent {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem;
        border-radius: 8px;
        border: 2px solid transparent;
        transition: border-color 0.2s ease;
        min-width: 80px;
    }

    .opponent.active {
        border-color: #facc15;
        background: rgba(250, 204, 21, 0.08);
    }

    .name {
        font-size: 0.8rem;
        font-weight: 600;
        color: white;
        text-align: center;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .status {
        font-size: 0.7rem;
        color: #facc15;
        font-weight: 600;
    }

    .card-backs {
        position: relative;
        width: 52px;
        height: 68px;
    }

    .card-back {
        position: absolute;
        width: 40px;
        height: 60px;
        border-radius: 5px;
        background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #1e40af 100%);
        border: 1.5px solid #93c5fd;
        left: calc(var(--i) * 6px);
        top: calc(var(--i) * 2px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    /* Sprite mode: image supplies its own border and background */
    .card-back.sprite {
        background-color: transparent;
        border: none;
        background-repeat: no-repeat;
    }

    .empty-hand {
        color: rgba(255, 255, 255, 0.3);
        font-size: 1.2rem;
        line-height: 60px;
        text-align: center;
        width: 40px;
    }

    .card-count {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);
    }
</style>
