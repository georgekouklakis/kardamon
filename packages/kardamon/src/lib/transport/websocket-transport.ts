import type { Transport } from './transport';
import type { GameState, PlayerAction } from '../types/protocol';

export class WebSocketTransport implements Transport {
    private ws: WebSocket | null = null;
    private stateCallback: ((state: GameState) => void) | null = null;
    private errorCallback: ((message: string) => void) | null = null;

    constructor(private readonly url: string) {}

    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data as string) as GameState | { error: string };
            if ('error' in data) {
                this.errorCallback?.(data.error);
                return;
            }
            this.stateCallback?.(data);
        };
    }

    disconnect() {
        this.ws?.close();
        this.ws = null;
    }

    onStateUpdate(callback: (state: GameState) => void) {
        this.stateCallback = callback;
    }

    onActionError(callback: (message: string) => void) {
        this.errorCallback = callback;
    }

    async submitAction(action: PlayerAction) {
        this.ws?.send(JSON.stringify(action));
    }
}
