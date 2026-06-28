import type { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../server.js';

const authRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post<{
        Body: { email: string; name: string; password: string }
    }>('/register', async (req, reply) => {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return reply.status(400).send({ error: 'email, name and password are required' });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return reply.status(400).send({ error: 'Email already registered' });

        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { email, name, password: hash } });

        const token = fastify.jwt.sign(
            { sub: user.id, name: user.name },
            { expiresIn: '7d' }
        );
        return { token, user: { id: user.id, name: user.name, email: user.email } };
    });

    fastify.post<{
        Body: { email: string; password: string }
    }>('/login', async (req, reply) => {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return reply.status(401).send({ error: 'Invalid credentials' });
        }

        const token = fastify.jwt.sign(
            { sub: user.id, name: user.name },
            { expiresIn: '7d' }
        );
        return { token, user: { id: user.id, name: user.name, email: user.email } };
    });

    fastify.get('/me', {
        onRequest: [fastify.authenticate],
    }, async (req) => {
        const payload = req.user as { sub: string; name: string };
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        return user;
    });
};

export default authRoutes;
