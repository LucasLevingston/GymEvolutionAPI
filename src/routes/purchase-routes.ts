import { cancelPurchaseController } from 'controllers/purchase/cancel-purchase'
import { completePurchaseController } from 'controllers/purchase/complete-purchase'
import { createPurchaseController } from 'controllers/purchase/create'
import { getPurchaseByIdController } from 'controllers/purchase/get-by-id'
import { getPurchasesByUserIdController } from 'controllers/purchase/get-purchase-by-user-id'
import { getPurchasesByProfessionalIdController } from 'controllers/purchase/get-purchases-by-professional-id'
import { retryPaymentController } from 'controllers/purchase/retry-purchase'
import { updatePurchaseController } from 'controllers/purchase/update'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function purchaseRoutes(server: FastifyInstance) {
  server.post('/', createPurchaseController)

  server.get('/:id', getPurchaseByIdController)

  server.get('/user/:userId', getPurchasesByUserIdController)
  server.get('/professional/:professionalId', getPurchasesByProfessionalIdController)

  server.patch('/:id', updatePurchaseController)

  server.put('/:id/cancel', cancelPurchaseController)

  server.post(
    '/:id/complete',

    completePurchaseController
  )

  // server.post('/:id/refund', refundPurchaseController)

  server.post('/:id/retry-payment', retryPaymentController)
}
