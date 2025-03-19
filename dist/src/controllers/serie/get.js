"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSerieController = getSerieController;
const prisma_1 = require("lib/prisma");
async function getSerieController(request, reply) {
    try {
        const serie = await prisma_1.prisma.serie.findUnique({
            where: { id: request.params.id },
        });
        if (!serie) {
            return reply.code(404).send({ error: 'Serie not found' });
        }
        return reply.send(serie);
    }
    catch (error) {
        throw error;
    }
}
