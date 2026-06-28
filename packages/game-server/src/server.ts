import Fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';
import staticPlugin from '@fastify/static';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { RoomManager } from './room-manager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
// The compiled kardamon IIFE bundle — library has no card assets
const KARDAMON_LIB  = resolve(__dirname, '../../kardamon/dist/lib');
// All game-specific assets (HTML, card sheet, sprites) live here — not in kardamon
const HEARTS_CLIENT = resolve(__dirname, '../../hearts-client');

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
const PORT = parseInt(process.env.PORT ?? '3001');

const fastify = Fastify({ logger: { level: 'info' } });
const rooms = new RoomManager();

await fastify.register(cors, { origin: true });
await fastify.register(websocketPlugin);

// hearts-client owns index.html, cards.json, cards.png — all game-specific
// kardamon/dist/lib contributes only the framework IIFE (kardamon-game.js)
// Files in earlier roots take precedence on name collision
await fastify.register(staticPlugin, {
    root: [HEARTS_CLIENT, KARDAMON_LIB],
    prefix: '/',
});

fastify.get('/rooms', async () => rooms.listRooms());

interface GameQuery {
    room?: string;
    token?: string;
    name?: string;
}

fastify.get<{ Querystring: GameQuery }>(
    '/game',
    { websocket: true },
    (connection, req) => {
        const ws = (connection as any).socket ?? connection;
        const { room = 'default', token, name = 'Guest' } = req.query;

        let playerId: string;
        let playerName: string;

        if (token) {
            try {
                const payload = jwt.verify(token, JWT_SECRET) as { sub: string; name: string };
                playerId = payload.sub;
                playerName = payload.name;
            } catch {
                ws.close(1008, 'Invalid token');
                return;
            }
        } else {
            playerId = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            playerName = name;
        }

        const err = rooms.joinGame(ws, room, playerId, playerName);
        if (err) {
            ws.send(JSON.stringify({ error: err }));
            ws.close();
        }
    }
);

try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`game-server running on http://localhost:${PORT}`);
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
