"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMealController = createMealController;
const prisma_1 = require("lib/prisma");
async function createMealController(request, reply) {
    try {
        const meal = await prisma_1.prisma.meal.create({
            data: request.body,
        });
        return reply.code(201).send(meal);
    }
    catch (error) {
        throw error;
    }
}
