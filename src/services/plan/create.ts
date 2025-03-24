import { prisma } from 'lib/prisma';
import { CreatePlanInput } from 'schemas/plan-schema';

export async function createPlanService(data: CreatePlanInput) {
  return prisma.plan.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
      features: JSON.stringify(data.features),
      professionalId: data.professionalId,
    },
  });
}
