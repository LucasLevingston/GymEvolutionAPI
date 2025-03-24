import type { FastifyRequest } from 'fastify';
import * as notificationService from '../../services/notification';
import type { UserIdParams } from '../../schemas/notification-schema';

export async function deleteAllNotificationsController(
  request: FastifyRequest<{ Params: UserIdParams }>
) {
  try {
    const { userId } = request.params;
    await notificationService.deleteAllNotificationsService(userId);
    return {
      statusCode: 200,
      body: { success: true, message: 'All notifications deleted' },
    };
  } catch (error) {
    throw error;
  }
}
