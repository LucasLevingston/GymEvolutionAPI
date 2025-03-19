"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExerciseController = createExerciseController;
const prisma_1 = require("lib/prisma");
async function createExerciseController(request, reply) {
    try {
        const exercise = await prisma_1.prisma.exercise.create({
            data: request.body,
        });
        return reply.code(201).send(exercise);
    }
    catch (error) {
        throw error;
    }
}
