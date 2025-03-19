"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrainingDayController = updateTrainingDayController;
const prisma_1 = require("lib/prisma");
async function updateTrainingDayController(request, reply) {
    try {
        const trainingDay = await prisma_1.prisma.trainingDay.update({
            where: { id: request.params.id },
            data: request.body,
        });
        return reply.send(trainingDay);
    }
    catch (error) {
        throw error;
    }
}
