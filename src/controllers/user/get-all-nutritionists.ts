import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAllNutritionists } from '../../services/user/get-all-nutritionists';

export async function getAllNutritionistsController(reply: FastifyReply) {
  try {
    const nutritionists = await getAllNutritionists();

    return reply.send(nutritionists);
  } catch (error) {
    throw error;
  }
}
