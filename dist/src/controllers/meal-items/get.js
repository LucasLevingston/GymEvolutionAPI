"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMealItemController = getMealItemController;
const prisma_1 = require("lib/prisma");
async function getMealItemController(request, reply) {
    try {
        const mealItem = await prisma_1.prisma.mealItems.findUnique({
            where: { id: request.params.id },
        });
        if (!mealItem) {
            return reply.code(404).send({ error: 'Meal item not found' });
        }
        return reply.send(mealItem);
    }
    catch (error) {
        throw error;
    }
}
