import { mercadoPago } from '../../lib/mercadopago';

interface CreatePaymentParams {
  purchaseId: string;
  amount: number;
  description: string;
  successUrl: string;
  cancelUrl: string;
  customerName: string;
  professionalId: string;
  buyerId: string;
  planId: string;
}

export async function createPaymentService({
  purchaseId,
  amount,
  description,
  successUrl,
  cancelUrl,
  customerName,
  professionalId,
  buyerId,
  planId,
}: CreatePaymentParams) {
  try {
    // Create a preference with MercadoPago
    const preference = {
      items: [
        {
          id: purchaseId,
          title: description,
          quantity: 1,
          unit_price: amount,
          currency_id: 'BRL',
        },
      ],
      back_urls: {
        success: `${successUrl}?status=success`,
        failure: `${cancelUrl}?status=failure`,
        pending: `${successUrl}?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.API_BASE_URL}/api/webhooks/mercadopago`,
      metadata: {
        purchaseId,
        professionalId,
        buyerId,
        planId,
      },
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
    };

    const response = await mercadoPago.preference.create({ body: preference });

    // Return payment information
    return {
      paymentId: response.payment_methods?.default_card_id,
      paymentUrl: response.init_point,
      preferenceId: response.id,
      status: 'PENDING',
      paymentMethod: 'mercadopago', // Will be updated when payment is completed
    };
  } catch (error) {
    throw error;
  }
}
