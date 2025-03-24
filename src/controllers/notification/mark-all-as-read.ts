import type { FastifyRequest } from 'fastify';
import * as notificationService from '../../services/notification';
import type { UserIdParams } from '../../schemas/notification-schema';

export async function markAllAsReadController(
  request: FastifyRequest<{ Params: UserIdParams }>
) {
  try {
    const { userId } = request.params;
    await notificationService.markAllAsReadService(userId);
    return {
      statusCode: 200,
      body: { success: true, message: 'All notifications marked as read' },
    };
  } catch (error) {
    throw error;
  }
}
