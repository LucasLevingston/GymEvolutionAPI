"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExerciseController = deleteExerciseController;
const prisma_1 = require("lib/prisma");
async function deleteExerciseController(request, reply) {
    try {
        await prisma_1.prisma.exercise.delete({
            where: { id: request.params.id },
        });
        return reply.send({ message: 'Exercise deleted successfully' });
    }
    catch (error) {
        throw error;
    }
}
