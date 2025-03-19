"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMealController = deleteMealController;
const prisma_1 = require("lib/prisma");
async function deleteMealController(request, reply) {
    try {
        await prisma_1.prisma.meal.delete({
            where: { id: request.params.id },
        });
        return reply.send({ message: 'Meal deleted successfully' });
    }
    catch (error) {
        throw error;
    }
}
