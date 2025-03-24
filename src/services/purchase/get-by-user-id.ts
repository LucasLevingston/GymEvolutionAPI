import { prisma } from 'lib/prisma';

export async function getPurchasesByUserIdService(
  userId: string,
  role: 'buyer' | 'professional',
  limit?: number,
  offset?: number,
  status?: string
) {
  const where = role === 'buyer' ? { buyerId: userId } : { professionalId: userId };

  if (status) {
    where.status = status;
  }

  return prisma.purchase.findMany({
    where,
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
    orderBy: { createdAt: 'desc' },
    ...(limit ? { take: limit } : {}),
    ...(offset ? { skip: offset } : {}),
  });
}
