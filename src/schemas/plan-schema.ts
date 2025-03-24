import { z } from 'zod';

export const planFeatureSchema = z.object({
  title: z.string(),
  included: z.boolean(),
});

export const createPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  features: z.array(z.string()),
  professionalId: z.string().uuid('Invalid professional ID format'),
});

export const updatePlanSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  duration: z.number().int().positive('Duration must be a positive integer').optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const planParamsSchema = z.object({
  id: z.string().uuid('Invalid plan ID format'),
});

export const professionalIdParamsSchema = z.object({
  professionalId: z.string().uuid('Invalid professional ID format'),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type PlanParams = z.infer<typeof planParamsSchema>;
export type ProfessionalIdParams = z.infer<typeof professionalIdParamsSchema>;
