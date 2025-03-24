import { FastifyRequest } from 'fastify';
import { CreatePurchaseInput, createPurchaseSchema } from 'schemas/purchase-schema';
import { createNotificationService } from 'services/notification';
import { createPurchaseService } from 'services/purchase/create';

export async function createPurchaseController(
  request: FastifyRequest<{ Body: CreatePurchaseInput }>
) {
  try {
    const purchaseData = request.body;
    console.log(createPurchaseSchema.parse(purchaseData));
    const purchase = await createPurchaseService(purchaseData);
    // await createNotificationService({
    //   title: 'Compra Realizada',
    //   message: `Você adquiriu o plano ${purchase.Plan.name}. Aguarde a confirmação do profissional.`,
    //   type: 'success',
    //   userId: purchase.buyerId,
    //   link: `/purchase-success/${purchase.professionalId}/${purchase.planId}`,
    // });

    // await createNotificationService({
    //   title: 'Nova Solicitação',
    //   message: 'Você recebeu uma nova solicitação de aluno.',
    //   type: 'info',
    //   userId: purchase.professionalId,
    //   link: '/professional-dashboard',
    // });

    return purchase;
  } catch (error) {
    throw error;
  }
}
