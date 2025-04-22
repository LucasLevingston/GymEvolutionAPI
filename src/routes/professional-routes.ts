import {
  getNutritionistsController,
  getTrainersController,
} from 'controllers/professional'
import { getProfessionalsController } from 'controllers/professional/get-all'
import { getProfessionalByIdController } from 'controllers/professional/get-by-id'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { registerProfessionalController } from '@/controllers/professional/register-professional'
import { authenticate } from 'middlewares/authenticate'
import { rejectProfessionalController } from 'controllers/professional/reject-professional'
import { approveProfessionalController } from 'controllers/professional/approve-professional'
import { getClientsByProfessionalIdController } from 'controllers/professional/get-clients-by-professional-id-controller'
import { getTasksByProfessionalIdController } from 'controllers/professional/get-tasks-by-professional-id-controller'
import { getMetricsByProfessionalIdController } from 'controllers/professional/get-metrics-by-professional-id-controller'
import { createDietForClientController } from 'controllers/professional/create-diet-for-client-controller'
import { createTrainingForClientController } from 'controllers/professional/create-training-for-client-controller'
// import { createTrainingFeedbackController } from 'controllers/professional/create-training-feedback-controller'
// import { createDietFeedbackController } from 'controllers/professional/create-diet-feedback-controller'

export async function professionalRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get('/:id', getProfessionalByIdController)
  server.get('/nutritionists', getNutritionistsController)
  server.get('/trainers', getTrainersController)
  server.get('/all', getProfessionalsController)

  server.post('/register', { onRequest: [authenticate] }, registerProfessionalController)
  server.get('/reject/:id', { onRequest: [authenticate] }, rejectProfessionalController)
  server.get('/approve/:id', { onRequest: [authenticate] }, approveProfessionalController)

  server.get(
    '/get-clients/:professionalId',
    { onRequest: [authenticate] },
    getClientsByProfessionalIdController
  )
  server.get(
    '/:professionalId/tasks',
    { onRequest: [authenticate] },
    getTasksByProfessionalIdController
  )
  server.get(
    '/:professionalId/metrics',
    { onRequest: [authenticate] },
    getMetricsByProfessionalIdController
  )

  // Novas rotas
  server.post(
    '/client/training',
    { onRequest: [authenticate] },
    createTrainingForClientController
  )

  server.post(
    '/client/diet',
    { onRequest: [authenticate] },
    createDietForClientController
  )

  // server.post(
  //   '/client/training-feedback',
  //   { onRequest: [authenticate] },
  //   createTrainingFeedbackController
  // )

  // server.post(
  //   '/client/diet-feedback',
  //   { onRequest: [authenticate] },
  //   createDietFeedbackController
  // )
}
