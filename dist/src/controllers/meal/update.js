"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMealController = updateMealController;
const prisma_1 = require("lib/prisma");
async function updateMealController(request, reply) {
    try {
        const meal = await prisma_1.prisma.meal.update({
            where: { id: request.params.id },
            data: request.body,
        });
        return reply.send(meal);
    }
    catch (error) {
        throw error;
    }
}
