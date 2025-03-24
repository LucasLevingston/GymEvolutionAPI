import { abacatePay } from '@/lib/abacate-pay';

interface CreatePaymentParams {
  purchaseId: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
  description: string;
  customerName: string;
  professionalId: string;
}

interface PaymentResult {
  paymentId: string;
  paymentUrl: string;
  status: string;
}

export async function createPaymentService(params: CreatePaymentParams) {
  try {
    const amountInCents = Math.round(params.amount * 100);

    const billing = await abacatePay.billing.create({
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [
        {
          externalId: params.purchaseId,
          name: params.description,
          quantity: 1,
          price: amountInCents,
        },
      ],
      returnUrl: params.cancelUrl,
      completionUrl: params.successUrl,
      customer: {
        email: params.customerName,
      },
    });

    return { billing };
  } catch (error) {
    console.error('Error creating payment with AbacatePay:', error);
    throw new Error('Failed to create payment with payment provider');
  }
}
