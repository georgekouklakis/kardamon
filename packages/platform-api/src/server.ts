import Fastify, { type FastifyRequest, type FastifyReply } from 'fastify';
import jwtPlugin from '@fastify/jwt';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import scoresRoutes from './routes/scores.js';

export const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
const PORT = parseInt(process.env.PORT ?? '3002');

const fastify = Fastify({ logger: { level: 'info' } });

await fastify.register(cors, { origin: true });
await fastify.register(jwtPlugin, { secret: JWT_SECRET });

fastify.decorate(
    'authenticate',
    async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await req.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    }
);

await fastify.register(authRoutes, { prefix: '/auth' });
await fastify.register(scoresRoutes, { prefix: '/scores' });

try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`platform-api running on http://localhost:${PORT}`);
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
