import { Purchase } from '@prisma/client';
import { ClientError } from 'errors/client-error';
import { FastifyRequest } from 'fastify';
import { PurchaseQuery } from 'schemas/purchase-schema';
import { getPurchasesByUserIdService } from 'services/purchase/get-by-user-id';

export async function getPurchasesByUserIdController(
  request: FastifyRequest<{ Querystring: PurchaseQuery }>
) {
  try {
    const { buyerId, professionalId, status, limit, offset } = request.query;

    if (!buyerId && !professionalId) {
      throw new ClientError('Either buyerId or professionalId is required');
    }

    const purchases = buyerId
      ? await getPurchasesByUserIdService(buyerId, 'buyer', limit, offset, status)
      : professionalId
      ? await getPurchasesByUserIdService(
          professionalId,
          'professional',
          limit,
          offset,
          status
        )
      : null;

    return purchases;
  } catch (error) {
    throw error;
  }
}
