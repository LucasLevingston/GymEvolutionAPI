import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAllUsers } from '../../services/user/get-all-users';
import { User } from '@prisma/client';

export async function getAllUsersController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { role } = request.user as User;

  if (role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Forbidden' });
  }

  const users = await getAllUsers();

  return reply.send(users);
}
