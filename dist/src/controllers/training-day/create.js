"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainingDayController = createTrainingDayController;
const prisma_1 = require("lib/prisma");
async function createTrainingDayController(request, reply) {
    try {
        const trainingDay = await prisma_1.prisma.trainingDay.create({
            data: request.body,
        });
        return reply.code(201).send(trainingDay);
    }
    catch (error) {
        throw error;
    }
}
