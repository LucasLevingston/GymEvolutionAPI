"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExerciseController = updateExerciseController;
const prisma_1 = require("lib/prisma");
async function updateExerciseController(request, reply) {
    try {
        const exercise = await prisma_1.prisma.exercise.update({
            where: { id: request.params.id },
            data: request.body,
        });
        return reply.send(exercise);
    }
    catch (error) {
        throw error;
    }
}
