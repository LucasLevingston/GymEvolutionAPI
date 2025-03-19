"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingDayController = getTrainingDayController;
const client_error_1 = require("errors/client-error");
const prisma_1 = require("lib/prisma");
async function getTrainingDayController(request, reply) {
    try {
        const trainingDay = await prisma_1.prisma.trainingDay.findUnique({
            where: { id: request.params.id },
        });
        if (!trainingDay) {
            new client_error_1.ClientError('Training day not found');
        }
        return reply.send(trainingDay);
    }
    catch (error) {
        throw error;
    }
}
