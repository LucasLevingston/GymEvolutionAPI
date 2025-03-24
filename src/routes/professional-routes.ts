import {
  getNutritionistsController,
  getTrainersController,
} from 'controllers/professional';
import { getProfessionalsController } from 'controllers/professional/get-all';
import { getProfessionalByIdController } from 'controllers/professional/get-by-id';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function professionalRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get('/:id', {}, getProfessionalByIdController);
  server.get('/nutritionists', {}, getNutritionistsController);
  server.get('/trainers', {}, getTrainersController);
  server.get('/', {}, getProfessionalsController);
}
