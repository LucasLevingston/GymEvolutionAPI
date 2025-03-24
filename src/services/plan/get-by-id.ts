import { prisma } from 'lib/prisma';

export async function getPlanByIdService(id: string): Promise<any> {
  const plan = await prisma.plan.findUnique({
    where: { id },
    include: {
      professional: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!plan) return null;

  return {
    ...plan,
    features: JSON.parse(plan.features),
  };
}
