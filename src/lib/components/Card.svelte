<script lang="ts">
    import { getContext } from 'svelte';
    import type { CardId, CardSheet } from '../types/protocol';

    interface Props {
        cardId: CardId;
        selected?: boolean;
        interactive?: boolean;
        onselect?: () => void;
    }

    let { cardId, selected = false, interactive = true, onselect }: Props = $props();

    // Context is a getter function so reads are reactive (see App.svelte setContext).
    const getSheet = getContext<(() => CardSheet | undefined) | undefined>('kardamon:cardSheet');
    const cardSheet = $derived(getSheet?.());

    // When a sheet is provided and the card ID is listed, use sprite rendering.
    const frame = $derived(cardSheet?.cards[cardId]);

    const spriteStyle = $derived((): string | undefined => {
        if (!cardSheet || !frame) return undefined;
        const scaleX = 72 / cardSheet.cardSize.w;
        const scaleY = 108 / cardSheet.cardSize.h;
        return [
            `background-image: url("${cardSheet.image}")`,
            `background-size: ${cardSheet.totalSize.w * scaleX}px ${cardSheet.totalSize.h * scaleY}px`,
            `background-position: ${-frame.x * scaleX}px ${-frame.y * scaleY}px`,
        ].join('; ');
    });

    // Text-based fallback for when no sheet is configured or the card ID is not in it.
    const SUIT_SYMBOLS: Record<string, string> = {
        hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠',
    };
    const suit = $derived(cardId.split('-')[0] ?? '');
    const rank = $derived(cardId.split('-')[1] ?? cardId);
    const isRed = $derived(suit === 'hearts' || suit === 'diamonds');
    const symbol = $derived(SUIT_SYMBOLS[suit] ?? suit);

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onselect?.();
        }
    }
</script>

{#if interactive}
    <button
        class="card"
        class:selected
        class:sprite={!!frame}
        class:red={!frame && isRed}
        style={spriteStyle()}
        aria-label="{frame ? cardId : `${rank} of ${suit}`}{selected ? ', selected' : ''}"
        aria-pressed={selected}
        onclick={onselect}
        onkeydown={handleKeydown}
    >
        {#if !frame}
            <span class="corner top-left">
                <span class="rank">{rank} chicken</span>
                <span class="suit">{symbol}</span>
            </span>
            <span class="center-suit" aria-hidden="true">{symbol}</span>
            <span class="corner bottom-right" aria-hidden="true">
                <span class="rank">{rank}</span>
                <span class="suit">{symbol}</span>
            </span>
        {/if}
    </button>
{:else}
    <div
        class="card"
        class:sprite={!!frame}
        class:red={!frame && isRed}
        style={spriteStyle()}
        role="img"
        aria-label={frame ? cardId : `${rank} of ${suit}`}
    >
        {#if !frame}
            <span class="corner top-left">
                <span class="rank">{rank}</span>
                <span class="suit">{symbol}</span>
            </span>
            <span class="center-suit" aria-hidden="true">{symbol}</span>
            <span class="corner bottom-right" aria-hidden="true">
                <span class="rank">{rank}</span>
                <span class="suit">{symbol}</span>
            </span>
        {/if}
    </div>
{/if}

<style>
    .card {
        width: 72px;
        height: 108px;
        border-radius: 8px;
        border: 1.5px solid #ccc;
        background: white;
        display: grid;
        grid-template-rows: auto 1fr auto;
        padding: 4px 5px;
        font-family: Georgia, serif;
        color: #1a1a1a;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        position: relative;
        user-select: none;
        flex-shrink: 0;
    }

    /* Sprite mode: the image contains its own border and background */
    .card.sprite {
        border: none;
        background-color: transparent;
        padding: 0;
        background-repeat: no-repeat;
    }

    button.card {
        cursor: pointer;
        transition:
            box-shadow 0.15s ease,
            border-color 0.15s ease;
    }

    .card.red {
        color: #c0392b;
    }

    button.card:focus-visible {
        outline: 3px solid #0066cc;
        outline-offset: 3px;
    }

    button.card.selected {
        border-color: #0066cc;
        box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.15),
            0 0 0 2px rgba(0, 102, 204, 0.4);
    }

    button.card.sprite.selected {
        border: none;
        box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.15),
            0 0 0 3px rgba(0, 102, 204, 0.6);
    }

    button.card:not(.selected):hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .corner {
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1;
        font-size: 0.7rem;
        font-weight: 700;
    }

    .bottom-right {
        transform: rotate(180deg);
        align-self: end;
        justify-self: end;
    }

    .center-suit {
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .suit {
        font-size: 0.55rem;
    }
</style>
