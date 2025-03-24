import { prisma } from 'lib/prisma';

export async function deactivatePlanService(id: string) {
  const plan = await prisma.plan.update({
    where: { id },
    data: { isActive: false },
  });

  return {
    ...plan,
    features: JSON.parse(plan.features),
  };
}
