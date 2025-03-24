import { prisma } from 'lib/prisma';

export async function getPlansByProfessionalIdService(professionalId: string) {
  const plans = await prisma.plan.findMany({
    where: {
      professionalId,
      isActive: true,
    },
    orderBy: {
      price: 'asc',
    },
  });

  return plans.map((plan) => ({
    ...plan,
    features: JSON.parse(plan.features),
  }));
}
