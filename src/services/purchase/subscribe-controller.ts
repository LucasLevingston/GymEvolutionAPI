import { FastifyRequest, FastifyReply } from 'fastify'
import SubscriptionService, {
  CreateSubscriptionDTO,
} from '../services/subscription-service'

export default class SubscriptionController {
  private subscriptionService: SubscriptionService

  constructor(fastify: any) {
    this.subscriptionService = new SubscriptionService(fastify)
  }

  async getPlans(request: FastifyRequest, reply: FastifyReply) {
    try {
      const plans = await this.subscriptionService.getAllPlans()
      return reply.code(200).send(plans)
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch subscription plans' })
    }
  }

  async getPlan(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const plan = await this.subscriptionService.getPlanById(id)

      if (!plan) {
        return reply.code(404).send({ error: 'Subscription plan not found' })
      }

      return reply.code(200).send(plan)
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch subscription plan' })
    }
  }

  async getUserSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id
      const subscription = await this.subscriptionService.getUserSubscription(userId)

      return reply.code(200).send(subscription)
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch user subscription' })
    }
  }

  async createSubscription(
    request: FastifyRequest<{ Body: CreateSubscriptionDTO }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.id
      const { subscriptionPlanId, billingInterval } = request.body

      // Check if user already has an active subscription
      const existingSubscription = await this.subscriptionService.getUserSubscription(
        userId
      )
      if (existingSubscription) {
        return reply.code(400).send({
          error: 'User already has an active subscription',
          subscription: existingSubscription,
        })
      }

      const result = await this.subscriptionService.createSubscription({
        userId,
        subscriptionPlanId,
        billingInterval,
      })

      return reply.code(201).send(result)
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to create subscription' })
    }
  }

  async cancelSubscription(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const userId = request.user.id

      const subscription = await this.subscriptionService.cancelSubscription(id, userId)

      return reply.code(200).send(subscription)
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to cancel subscription' })
    }
  }

  async handleWebhook(
    request: FastifyRequest<{ Body: { data: { id: string }; type: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { data, type } = request.body

      // Only process payment notifications
      if (type !== 'payment') {
        return reply.code(200).send()
      }

      // Get payment details from Mercado Pago
      const paymentId = data.id
      const payment = await request.server.mercadopago.payment.get(paymentId)

      // Process the payment webhook
      await this.subscriptionService.processPaymentWebhook(
        payment.body.external_reference,
        payment.body.status
      )

      return reply.code(200).send()
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to process webhook' })
    }
  }
}
