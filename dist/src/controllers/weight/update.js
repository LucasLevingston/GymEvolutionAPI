"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWeightController = updateWeightController;
const prisma_1 = require("@/lib/prisma");
async function updateWeightController(request, reply) {
    try {
        const weight = await prisma_1.prisma.weight.update({
            where: { id: request.params.id },
            data: request.body,
        });
        return reply.send(weight);
    }
    catch (error) {
        throw error;
    }
}
