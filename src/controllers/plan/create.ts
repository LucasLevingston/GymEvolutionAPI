import { User } from '@prisma/client';
import { ClientError } from 'errors/client-error';
import { FastifyRequest } from 'fastify';
import { CreatePlanInput } from 'schemas/plan-schema';
import { createPlanService } from 'services/plan/create';

export async function createPlanController(
  request: FastifyRequest<{ Body: CreatePlanInput }>
) {
  try {
    const user = request.user as User;
    if (user.role !== 'NUTRITIONIST' && user.role !== 'TRAINER') {
      throw new ClientError('Only professionals can create plans');
    }

    if (user.id !== request.body.professionalId) {
      throw new ClientError('You can only create plans for yourself');
    }

    const plan = await createPlanService(request.body);

    return plan;
  } catch (error) {
    throw error;
  }
}
