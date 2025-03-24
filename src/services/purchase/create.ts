import { PrismaClient } from '@prisma/client';
import { CreatePurchaseInput } from 'schemas/purchase-schema';
import { createPaymentService } from 'services/abacatepay/create';

export async function createPurchaseService(params: CreatePurchaseInput) {
  const prisma = new PrismaClient();
  const { planId, successUrl, cancelUrl, amount, buyerId } = params;

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { professional: true },
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

    if (!plan.isActive) {
      throw new Error('Plan is not active');
    }

    const purchase = await prisma.purchase.create({
      data: {
        planId,
        amount,
        status: 'PENDING',
        paymentMethod: 'pix',
        professionalId: plan.professionalId,
        buyerId,
      },
    });

    const paymentResult = await createPaymentService({
      purchaseId: purchase.id,
      amount,
      successUrl,
      cancelUrl,
      description: `Payment for ${plan.name}`,
      customerName: buyerId, // Ideally, this would be the customer's name
      professionalId: plan.professionalId,
    });

    // Update purchase with payment information
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {},
    });

    return {
      purchaseId: purchase.id,
      // paymentId: paymentResult.paymentId,
      // paymentUrl: paymentResult.paymentUrl,
      status: purchase.status,
    };
  } finally {
    await prisma.$disconnect();
  }
}
