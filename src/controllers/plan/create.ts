import type { User } from '@prisma/client'
import { ClientError } from 'errors/client-error'
import type { FastifyRequest } from 'fastify'
import { type CreatePlanInput, getPredefinedFeatures } from 'schemas/plan-schema'
import { createPlanService } from 'services/plan/create'

export async function createPlanController(
  request: FastifyRequest<{ Body: CreatePlanInput }>
) {
  try {
    const user = request.user as User
    if (user.role !== 'NUTRITIONIST' && user.role !== 'TRAINER') {
      throw new ClientError('Only professionals can create plans')
    }

    if (user.id !== request.body.professionalId) {
      throw new ClientError('You can only create plans for yourself')
    }

    // Ensure professionalType matches user role
    if (user.role !== request.body.professionalType) {
      throw new ClientError('Professional type must match your role')
    }

    // Process features if they are predefined feature IDs
    const body = { ...request.body }

    if (body.isCustom === false) {
      // If using predefined features, convert IDs to labels
      const predefinedFeatures = getPredefinedFeatures(
        user.role as 'NUTRITIONIST' | 'TRAINER'
      )

      // Map feature IDs to their labels
      body.features = body.features.map((featureId) => {
        const feature = predefinedFeatures.find((f) => f.id === featureId)
        return feature ? feature.label : featureId
      })
    }

    // Determine if plan requires initial meeting and follow-ups based on features
    const hasInitialConsultation = body.features.some(
      (feature) =>
        feature.toLowerCase().includes('inicial') ||
        feature.toLowerCase().includes('initial')
    )

    const hasFollowUp = body.features.some(
      (feature) =>
        feature.toLowerCase().includes('retorno') ||
        feature.toLowerCase().includes('follow') ||
        feature.toLowerCase().includes('acompanhamento')
    )

    // Set workflow metadata
    body.requiresInitialMeeting = hasInitialConsultation
    body.requiresFollowUp = hasFollowUp

    // Count how many follow-ups are included
    const followUpCount = body.features.filter(
      (feature) =>
        feature.toLowerCase().includes('retorno') ||
        feature.toLowerCase().includes('follow')
    ).length

    body.maxFollowUps = followUpCount > 0 ? followUpCount : 0

    const plan = await createPlanService(body)

    return plan
  } catch (error) {
    throw error
  }
}
