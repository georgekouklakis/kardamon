import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../server.js';

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? 'dev-internal-key';

const scoresRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/leaderboard', async () => {
        const users = await prisma.user.findMany({
            include: { games: { select: { score: true, won: true } } },
        });

        return users
            .map(u => ({
                id: u.id,
                name: u.name,
                gamesPlayed: u.games.length,
                wins: u.games.filter(g => g.won).length,
                totalScore: u.games.reduce((s, g) => s + g.score, 0),
                avgScore: u.games.length > 0
                    ? Math.round(u.games.reduce((s, g) => s + g.score, 0) / u.games.length)
                    : 0,
            }))
            .sort((a, b) => a.avgScore - b.avgScore) // lower score is better in Hearts
            .slice(0, 20);
    });

    fastify.get('/me', { onRequest: [fastify.authenticate] }, async (req) => {
        const payload = req.user as { sub: string };
        const games = await prisma.gamePlayer.findMany({
            where: { userId: payload.sub },
            include: { game: { select: { playedAt: true, rounds: true } } },
            orderBy: { game: { playedAt: 'desc' } },
            take: 20,
        });
        return games;
    });

    // Called by game-server after a game finishes (internal endpoint)
    fastify.post<{
        Body: {
            rounds: number;
            players: Array<{
                userId?: string;
                name: string;
                score: number;
                seat: number;
                isBot: boolean;
                won: boolean;
            }>;
        }
    }>('/games/result', {
        preHandler: async (req, reply) => {
            const key = req.headers['x-internal-api-key'];
            if (key !== INTERNAL_API_KEY) {
                return reply.status(403).send({ error: 'Forbidden' });
            }
        },
    }, async (req) => {
        const { rounds, players } = req.body;

        const game = await prisma.game.create({
            data: {
                rounds,
                players: {
                    create: players.map(p => ({
                        userId: p.userId ?? null,
                        name: p.name,
                        score: p.score,
                        seat: p.seat,
                        isBot: p.isBot,
                        won: p.won,
                    })),
                },
            },
        });

        return { gameId: game.id };
    });
};

export default scoresRoutes;
