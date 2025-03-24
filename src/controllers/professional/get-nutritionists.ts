import type { FastifyRequest } from 'fastify';
import * as professionalService from '../../services/professional';

export async function getNutritionistsController(request: FastifyRequest) {
  try {
    const nutritionists = await professionalService.getNutritionistsService();
    return nutritionists;
  } catch (error) {
    throw error;
  }
}
