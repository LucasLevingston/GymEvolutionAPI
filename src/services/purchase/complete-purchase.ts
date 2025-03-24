import { prisma } from 'lib/prisma';

export async function completePurchaseService(
  id: string,
  paymentMethod: string,
  paymentId: string
) {
  return prisma.purchase.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      paymentMethod,
      paymentId,
    },
  });
}
