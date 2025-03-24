import type { FastifyRequest } from 'fastify';
import * as professionalService from '../../services/professional';

export async function getTrainersController(request: FastifyRequest) {
  try {
    const trainers = await professionalService.getTrainersService();
    return trainers;
  } catch (error) {
    throw error;
  }
}
