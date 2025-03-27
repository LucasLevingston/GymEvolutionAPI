import type { FastifyReply, FastifyRequest } from 'fastify';
import { updateUserService } from '../../services/user/update-user';
import type { User } from '@prisma/client';
import { ClientError } from '../../errors/client-error';
import { addToHistory } from '../../services/history/add';

interface Params {
  id: string;
}

export async function updateUserController(
  request: FastifyRequest<{
    Params: Params;
    Body: User;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const { id: userId, role } = request.user as User;

    const updateData = request.body;

    if (id !== userId && role !== 'ADMIN') {
      throw new ClientError('Forbidden');
    }

    const history = await addToHistory(updateData);
    if (!history) throw new ClientError('Error on add to history');

    const updatedUser = await updateUserService(updateData);

    return reply.status(200).send(updatedUser);
  } catch (error) {
    throw error;
  }
}
