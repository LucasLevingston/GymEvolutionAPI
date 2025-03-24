import { prisma } from 'lib/prisma';
import { UpdatePurchaseInput } from 'schemas/purchase-schema';

export async function updatePurchaseService(id: string, data: UpdatePurchaseInput) {
  const purchase = await prisma.purchase.update({
    where: { id },
    data,
    include: {
      relationship: true,
    },
  });

  // If the purchase status is updated to CANCELLED, also update the relationship status
  if (data.status === 'CANCELLED' && purchase.relationshipId) {
    await prisma.relationship.update({
      where: { id: purchase.relationshipId },
      data: { status: 'REJECTED' },
    });
  }

  // If the purchase status is updated to COMPLETED, the relationship remains PENDING
  // until the professional accepts it

  return purchase;
}
