import { prisma } from 'lib/prisma';

export async function refundPurchaseService(id: string) {
  return prisma.purchase.update({
    where: { id },
    data: {
      status: 'REFUNDED',
    },
  });
}
