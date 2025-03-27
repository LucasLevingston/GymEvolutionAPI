import { prisma } from '../../lib/prisma';
import { mercadoPago } from '@/lib/mercadopago';

export async function completePurchaseService(
  id: string,
  paymentMethod: string,
  paymentId: string
) {
  try {
    // Get the purchase by payment ID
    const purchase = await prisma.purchase.findFirst({
      where: {
        paymentId: paymentId,
      },
      include: {
        Plan: true,
        professional: true,
      },
    });

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    // Check if the purchase is already completed
    if (purchase.status === 'COMPLETED') {
      return purchase;
    }

    // Verify payment status with MercadoPago
    const payment = await mercadoPago.payment.get({ id: paymentId });

    if (payment.status !== 'approved') {
      throw new Error('Payment not completed');
    }

    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Update the purchase status
      const updatedPurchase = await tx.purchase.update({
        where: {
          id: purchase.id,
        },
        data: {
          paymentMethod,
          paymentId,
          status: 'COMPLETED',
        },
      });

      // Create a professional-student relationship if it doesn't exist
      const existingRelationship = await tx.relationship.findFirst({
        where: {
          OR: [
            {
              nutritionistId: purchase.professionalId,
              studentId: purchase.buyerId,
            },
            {
              trainerId: purchase.professionalId,
              student2Id: purchase.buyerId,
            },
          ],
        },
      });

      let relationshipId = existingRelationship?.id;

      if (!existingRelationship) {
        // Determine if the professional is a nutritionist or trainer based on role
        const isProfessionalNutritionist = purchase.professional.role === 'NUTRITIONIST';

        const newRelationship = await tx.relationship.create({
          data: isProfessionalNutritionist
            ? {
                nutritionistId: purchase.professionalId,
                studentId: purchase.buyerId,
                status: 'ACTIVE',
              }
            : {
                trainerId: purchase.professionalId,
                student2Id: purchase.buyerId,
                status: 'ACTIVE',
              },
        });
        relationshipId = newRelationship.id;
      } else if (existingRelationship.status !== 'ACTIVE') {
        // Update the relationship if it exists but is not active
        await tx.relationship.update({
          where: {
            id: existingRelationship.id,
          },
          data: {
            status: 'ACTIVE',
          },
        });
      }

      // Update the purchase with the relationship ID if it doesn't have one
      if (!updatedPurchase.relationshipId && relationshipId) {
        await tx.purchase.update({
          where: {
            id: purchase.id,
          },
          data: {
            relationshipId: relationshipId,
          },
        });
      }

      // Create a notification for the professional
      await tx.notification.create({
        data: {
          userId: purchase.professionalId,
          title: 'Novo cliente!',
          message: `Um cliente adquiriu seu plano ${purchase.Plan.name}`,
          type: 'success',
          read: false,
          link: `/clients/${purchase.buyerId}`,
        },
      });

      // Create a notification for the buyer
      await tx.notification.create({
        data: {
          userId: purchase.buyerId,
          title: 'Compra concluída!',
          message: `Sua compra do plano ${purchase.Plan.name} foi concluída com sucesso`,
          type: 'success',
          read: false,
          link: '/my-purchases',
        },
      });

      return updatedPurchase;
    });
  } catch (error) {
    console.error('Error completing purchase:', error);
    throw error;
  }
}
