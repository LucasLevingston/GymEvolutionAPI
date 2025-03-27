import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { generateAuthUrl } from 'services/google-auth/auth';

export async function getAuthUrl(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id: userId } = request.user as User;

    if (!userId) {
      return reply.code(401).send({ error: 'Authentication required' });
    }

    const authUrl = await generateAuthUrl(userId);

    reply.send({ authUrl });
  } catch (error) {
    throw error;
  }
}
