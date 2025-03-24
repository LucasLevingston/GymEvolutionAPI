import { createPlanController } from 'controllers/plan/create';
import { deactivatePlanController } from 'controllers/plan/deactivate';
import { getPlanByIdController } from 'controllers/plan/get-by-id';
import { getPlansByProfessionalIdController } from 'controllers/plan/get-plans-professional-id';
import { updatePlanController } from 'controllers/plan/update';
import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authenticate } from 'middlewares/authenticate';
import { errorResponseSchema } from 'schemas/error-schema';
import { z } from 'zod';

const planFeatureSchema = z.string();

const planSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  duration: z.number(),
  features: z.array(planFeatureSchema),
  isActive: z.boolean(),
  professionalId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const planWithProfessionalSchema = planSchema.extend({
  professional: z.object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    email: z.string(),
    role: z.string(),
  }),
});

const createPlanRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  features: z.array(planFeatureSchema),
  professionalId: z.string().uuid('Invalid professional ID format'),
});

const updatePlanRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  duration: z.number().int().positive('Duration must be a positive integer').optional(),
  features: z.array(planFeatureSchema).optional(),
  isActive: z.boolean().optional(),
});

export async function planRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', authenticate);

  server.post(
    '/',
    // {
    //   schema: {
    //     body: createPlanRequestSchema,
    //     response: {
    //       201: planSchema,
    //       403: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['plans'],
    //     summary: 'Create a new plan',
    //     description: 'Create a new plan for a professional',
    //   },
    // },
    createPlanController
  );

  server.get(
    '/:id',
    // {
    //   schema: {
    //     params: z.object({
    //       id: z.string().uuid('Invalid plan ID format'),
    //     }),
    //     response: {
    //       200: planWithProfessionalSchema,
    //       404: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['plans'],
    //     summary: 'Get plan by ID',
    //     description: 'Get detailed information about a plan by its ID',
    //   },
    // },
    getPlanByIdController
  );

  server.get(
    '/professional/:professionalId',
    // {
    //   schema: {
    //     params: z.object({
    //       professionalId: z.string().uuid('Invalid professional ID format'),
    //     }),
    //     response: {
    //       200: z.array(planSchema),
    //       500: errorResponseSchema,
    //     },
    //     tags: ['plans'],
    //     summary: 'Get plans by professional ID',
    //     description: 'Get all active plans for a specific professional',
    //   },
    // },
    getPlansByProfessionalIdController
  );

  server.patch(
    '/:id',
    // {
    //   schema: {
    //     params: z.object({
    //       id: z.string().uuid('Invalid plan ID format'),
    //     }),
    //     body: updatePlanRequestSchema,
    //     response: {
    //       200: planSchema,
    //       403: errorResponseSchema,
    //       404: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['plans'],
    //     summary: 'Update plan',
    //     description: 'Update plan details',
    //   },
    // },
    updatePlanController
  );

  server.delete(
    '/:id',
    // {
    //   schema: {
    //     params: z.object({
    //       id: z.string().uuid('Invalid plan ID format'),
    //     }),
    //     response: {
    //       200: planSchema,
    //       403: errorResponseSchema,
    //       404: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['plans'],
    //     summary: 'Deactivate plan',
    //     description: 'Deactivate a plan (soft delete)',
    //   },
    // },
    deactivatePlanController
  );
}
