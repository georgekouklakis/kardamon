import type { GameState, PlayerAction } from '../types/protocol';

export interface Transport {
    connect(): void;
    disconnect(): void;
    onStateUpdate(callback: (state: GameState) => void): void;
    submitAction(action: PlayerAction): Promise<void>;
}
