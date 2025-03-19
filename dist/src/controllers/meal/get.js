"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMealController = getMealController;
const prisma_1 = require("lib/prisma");
async function getMealController(request, reply) {
    try {
        const meal = await prisma_1.prisma.meal.findUnique({
            where: { id: request.params.id },
        });
        if (!meal) {
            return reply.code(404).send({ error: 'Meal not found' });
        }
        return reply.send(meal);
    }
    catch (error) {
        throw error;
    }
}
