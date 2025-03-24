import { prisma } from 'lib/prisma';

export async function getPurchaseByIdService(id: string) {
  return prisma.purchase.findUnique({
    where: { id },
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
          role: true,
        },
      },
      relationship: true,
    },
  });
}
