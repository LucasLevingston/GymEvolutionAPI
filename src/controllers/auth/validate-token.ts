import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from 'utils/jwt';

export async function validateTokenController(
  request: FastifyRequest<{ Body: { token: string } }>,
  reply: FastifyReply
) {
  try {
    const { token } = request.body;

    const isValid = verifyToken(token);

    return isValid;
  } catch (error) {
    throw error;
  }
}
