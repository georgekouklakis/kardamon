<script lang="ts">
    import { untrack, setContext } from 'svelte';
    import GameTable from './lib/components/GameTable.svelte';
    import { WebSocketTransport } from './lib/transport/websocket-transport';
    import { MockTransport } from './lib/transport/mock-transport';
    import type { Transport } from './lib/transport/transport';
    import type { CardSheet } from './lib/types/protocol';

    interface Props {
        wsUrl?: string;
        cardSheet?: CardSheet;
    }

    let { wsUrl, cardSheet }: Props = $props();

    // Make the sheet available to Card.svelte anywhere in the tree without prop-drilling.
    // Pass as a getter so the context stays reactive if the prop ever changes.
    setContext('kardamon:cardSheet', () => cardSheet);

    // transport is created once on mount; wsUrl changing mid-game is not supported
    const transport: Transport = untrack(() =>
        wsUrl ? new WebSocketTransport(wsUrl) : new MockTransport()
    );
</script>

<GameTable {transport} />
