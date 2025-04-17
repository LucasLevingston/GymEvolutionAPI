import {
  getNutritionistsController,
  getTrainersController,
} from 'controllers/professional'
import { getProfessionalsController } from 'controllers/professional/get-all'
import { getProfessionalByIdController } from 'controllers/professional/get-by-id'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { registerProfessionalController } from '@/controllers/professional/register-professional'
import { authenticate } from 'middlewares/authenticate'
import { rejectProfessionalController } from 'controllers/professional/reject-professional'
import { approveProfessionalController } from 'controllers/professional/approve-professional'
import { getClientsByProfessionalIdController } from 'controllers/professional/get-clients-by-professional-id-controller'
import { getTasksByProfessionalIdController } from 'controllers/professional/get-tasks-by-professional-id-controller'
import { getMetricsByProfessionalIdController } from 'controllers/professional/get-metrics-by-professional-id-controller'

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
}
