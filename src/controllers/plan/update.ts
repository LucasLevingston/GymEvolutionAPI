import { User } from '@prisma/client'
import { ClientError } from 'errors/client-error'
import { FastifyRequest } from 'fastify'
import { UpdatePlanInput } from 'schemas/plan-schema'
import { getPlanByIdService } from 'services/plan/get-by-id'
import { updatePlanService } from 'services/plan/update-plan-service'

export async function updatePlanController(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdatePlanInput }>
) {
  try {
    const { id } = request.params
    const user = request.user as User

    const plan = await getPlanByIdService(id)
    if (!plan) {
      throw new ClientError('Plan not found')
    }

    if (plan.professional.id !== user.id) {
      throw new ClientError('You can only update your own plans')
    }

    const updatedPlan = await updatePlanService(id, request.body)

    return updatedPlan
  } catch (error) {
    throw error
  }
}
