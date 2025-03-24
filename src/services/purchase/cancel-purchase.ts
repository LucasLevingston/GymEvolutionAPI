import { prisma } from 'lib/prisma';

export async function cancelPurchaseService(
  id: string,
  reason: string,
  comment?: string
) {
  const purchase = await prisma.purchase.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancelReason: reason,
      cancelComment: comment,
      cancelledAt: new Date(),
    },
    include: {
      relationship: true,
    },
  });

  // Also update the relationship status
  if (purchase.relationshipId) {
    await prisma.relationship.update({
      where: { id: purchase.relationshipId },
      data: { status: 'REJECTED' },
    });
  }

  return purchase;
}
