"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseController = getExerciseController;
const prisma_1 = require("lib/prisma");
async function getExerciseController(request, reply) {
    try {
        const exercise = await prisma_1.prisma.exercise.findUnique({
            where: { id: request.params.id },
        });
        if (!exercise) {
            return reply.code(404).send({ error: 'Exercise not found' });
        }
        return reply.send(exercise);
    }
    catch (error) {
        throw error;
    }
}
