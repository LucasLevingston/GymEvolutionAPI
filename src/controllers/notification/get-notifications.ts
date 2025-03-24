import type { FastifyRequest } from 'fastify';
import * as notificationService from '../../services/notification';
import type { NotificationQuery } from '../../schemas/notification-schema';

export async function getNotificationsController(
  request: FastifyRequest<{ Querystring: NotificationQuery }>
) {
  try {
    const { userId, limit, offset, read } = request.query;
    const readBoolean = read ? read === 'true' : undefined;

    const notifications = await notificationService.getNotificationsByUserIdService(
      userId,
      limit,
      offset,
      readBoolean
    );
    return notifications;
  } catch (error) {
    throw error;
  }
}
