import type { FastifyReply, FastifyRequest } from 'fastify';
import { updateUser } from '../../services/user/update-user';
import { User } from '@prisma/client';
import { ClientError } from 'errors/client-error';
import { addToHistory } from 'services/history/add';

interface Params {
  id: string;
}

export async function updateUserController(
  request: FastifyRequest<{
    Params: Params;
    Body: User;
  }>
) {
  try {
    console.log(request.user);
    const { id } = request.params;
    const { id: userId, role } = request.user as User;

    const updateData = request.body;
    if (id !== userId && role !== 'ADMIN') {
      throw new ClientError('Forbidden');
    }
    const history = await addToHistory(updateData);
    if (!history) throw new ClientError('Error on add to history');

    const updatedUser = await updateUser(updateData);

    return updatedUser;
  } catch (error) {
    throw error;
  }
}
