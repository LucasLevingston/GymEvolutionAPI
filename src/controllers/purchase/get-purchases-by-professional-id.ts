import { FastifyRequest } from 'fastify'
import { PurchaseQuery } from 'schemas/purchase-schema'
import { getPurchasesByProfessionalIdService } from 'services/purchase/get-purchases-by-professional-id'

export async function getPurchasesByProfessionalIdController(
  request: FastifyRequest<{
    Querystring: PurchaseQuery
    Params: { professionalId: string }
  }>
) {
  try {
    const { professionalId } = request.params

    const purchases = await getPurchasesByProfessionalIdService(professionalId)

    return purchases
  } catch (error) {
    throw error
  }
}
