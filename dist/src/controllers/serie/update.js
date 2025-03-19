"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSerieController = updateSerieController;
const prisma_1 = require("lib/prisma");
async function updateSerieController(request, reply) {
    try {
        const serie = await prisma_1.prisma.serie.update({
            where: { id: request.params.id },
            data: request.body,
        });
        return reply.send(serie);
    }
    catch (error) {
        throw error;
    }
}
