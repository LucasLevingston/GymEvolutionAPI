import type { FastifyRequest } from 'fastify';
import * as notificationService from '../../services/notification';
import type { CreateNotificationInput } from '../../schemas/notification-schema';

export async function createNotificationController(
  request: FastifyRequest<{ Body: CreateNotificationInput }>
) {
  try {
    const notification = await notificationService.createNotificationService(
      request.body
    );
    return { statusCode: 201, body: notification };
  } catch (error) {
    throw error;
  }
}
