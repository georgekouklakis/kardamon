import type { Transport } from './transport';
import type { GameState, PlayerAction } from '../types/protocol';

export class WebSocketTransport implements Transport {
    private ws: WebSocket | null = null;
    private stateCallback: ((state: GameState) => void) | null = null;

    constructor(private readonly url: string) {}

    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = (event) => {
            const state = JSON.parse(event.data as string) as GameState;
            this.stateCallback?.(state);
        };
    }

    disconnect() {
        this.ws?.close();
        this.ws = null;
    }

    onStateUpdate(callback: (state: GameState) => void) {
        this.stateCallback = callback;
    }

    async submitAction(action: PlayerAction) {
        this.ws?.send(JSON.stringify(action));
    }
}
