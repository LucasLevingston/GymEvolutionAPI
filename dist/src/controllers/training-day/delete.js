"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrainingDayController = deleteTrainingDayController;
const prisma_1 = require("lib/prisma");
async function deleteTrainingDayController(request, reply) {
    try {
        await prisma_1.prisma.trainingDay.delete({
            where: { id: request.params.id },
        });
        return reply.send({ message: 'Training day deleted successfully' });
    }
    catch (error) {
        throw error;
    }
}
