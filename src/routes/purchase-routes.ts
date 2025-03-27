import { cancelPurchaseController } from 'controllers/purchase/cancel-purchase';
import { completePurchaseController } from 'controllers/purchase/complete-purchase';
import { createPurchaseController } from 'controllers/purchase/create';
import { getPurchaseByIdController } from 'controllers/purchase/get-by-id';
import { getPurchasesByUserIdController } from 'controllers/purchase/get-purchase-by-user-id';
import { retryPaymentController } from 'controllers/purchase/retry-purchase';
import { updatePurchaseController } from 'controllers/purchase/update';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

const errorResponseSchema = z.object({
  error: z.string(),
});

const purchaseSchema = z.object({
  id: z.string().uuid(),
  buyerId: z.string().uuid(),
  professionalId: z.string().uuid(),
  planId: z.string(),
  planName: z.string(),
  planDescription: z.string().nullable(),
  amount: z.number().positive(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED']),
  paymentMethod: z.string().nullable(),
  paymentId: z.string().nullable(),
  cancelReason: z.string().nullable(),
  cancelComment: z.string().nullable(),
  cancelledAt: z.string().nullable(),
  relationshipId: z.string().uuid().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const purchaseWithRelationsSchema = purchaseSchema.extend({
  buyer: z.object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    email: z.string(),
  }),
  professional: z.object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    email: z.string(),
    role: z.string(),
  }),
  relationship: z
    .object({
      id: z.string().uuid(),
      status: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .nullable(),
});

const createPurchaseRequestSchema = z.object({
  buyerId: z.string().uuid(),
  professionalId: z.string().uuid(),
  planId: z.string(),
  planName: z.string(),
  planDescription: z.string().optional(),
  amount: z.number().positive(),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
});

const updatePurchaseRequestSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED']).optional(),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
  cancelReason: z.string().optional(),
  cancelComment: z.string().optional(),
  cancelledAt: z.date().optional(),
});

const cancelPurchaseRequestSchema = z.object({
  reason: z.string(),
  comment: z.string().optional(),
});

const completePurchaseRequestSchema = z.object({
  paymentMethod: z.string(),
  paymentId: z.string(),
});

const purchaseParamsSchema = z.object({
  id: z.string().uuid(),
});

const purchaseQuerySchema = z.object({
  buyerId: z.string().uuid().optional(),
  professionalId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED']).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

export async function purchaseRoutes(server: FastifyInstance) {
  // Create a new purchase
  server.post(
    '/',
    // {
    //   schema: {
    //     body: createPurchaseRequestSchema,
    //     response: {
    //       201: purchaseSchema,
    //       400: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['purchases'],
    //     summary: 'Create a new purchase',
    //     description: 'Create a new purchase between a buyer and a professional',
    //   },
    // },
    createPurchaseController
  );

  // Get a purchase by ID
  server.get(
    '/:id',
    {
      schema: {
        params: purchaseParamsSchema,
        response: {
          // 200: purchaseWithRelationsSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['purchases'],
        summary: 'Get purchase by ID',
        description: 'Get detailed information about a purchase by its ID',
      },
    },
    getPurchaseByIdController
  );

  // Get purchases by user ID (buyer or professional)
  server.get(
    '/user/:userId',
    // {
    //   schema: {
    //     querystring: purchaseQuerySchema,
    //     response: {
    //       200: z.array(purchaseWithRelationsSchema),
    //       400: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['purchases'],
    //     summary: 'Get purchases',
    //     description: 'Get purchases filtered by buyer ID, professional ID, or status',
    //   },
    // },
    getPurchasesByUserIdController
  );

  server.patch(
    '/:id',
    {
      schema: {
        params: purchaseParamsSchema,
        body: updatePurchaseRequestSchema,
        response: {
          200: purchaseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['purchases'],
        summary: 'Update purchase',
        description: 'Update purchase details like status, payment information, etc.',
      },
    },
    updatePurchaseController
  );

  server.put(
    '/:id/cancel',
    // {
    //   schema: {
    //     params: purchaseParamsSchema,
    //     body: cancelPurchaseRequestSchema,
    //     response: {
    //       200: purchaseSchema,
    //       404: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['purchases'],
    //     summary: 'Cancel purchase',
    //     description: 'Cancel a purchase and provide a reason',
    //   },
    // },
    cancelPurchaseController
  );

  server.post(
    '/:id/complete',
    {
      schema: {
        params: purchaseParamsSchema,
        body: completePurchaseRequestSchema,
        response: {
          200: purchaseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['purchases'],
        summary: 'Complete purchase',
        description: 'Mark a purchase as completed after payment confirmation',
      },
    },
    completePurchaseController
  );

  // server.post(
  //   '/:id/refund',
  //   {
  //     schema: {
  //       params: purchaseParamsSchema,
  //       response: {
  //         200: purchaseSchema,
  //         404: errorResponseSchema,
  //         500: errorResponseSchema,
  //       },
  //       tags: ['purchases'],
  //       summary: 'Refund purchase',
  //       description: 'Process a refund for a purchase',
  //     },
  //   },
  //   refundPurchaseController
  // );

  server.post('/:id/retry-payment', retryPaymentController);
}
