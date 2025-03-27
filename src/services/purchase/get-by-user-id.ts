import { prisma } from 'lib/prisma';

export async function getPurchasesByUserIdService(userId: string) {
  const purchase = prisma.purchase.findMany({
    where: { buyerId: userId },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      professional: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      Plan: true,
      relationship: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return purchase;
}
