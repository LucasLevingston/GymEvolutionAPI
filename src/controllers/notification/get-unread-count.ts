import type { FastifyRequest } from 'fastify';
import * as notificationService from '../../services/notification';
import type { UserIdParams } from '../../schemas/notification-schema';

export async function getUnreadCountController(
  request: FastifyRequest<{ Params: UserIdParams }>
) {
  try {
    const { userId } = request.params;
    const count = await notificationService.getUnreadCountService(userId);
    return { statusCode: 200, body: { count } };
  } catch (error) {
    throw error;
  }
}
