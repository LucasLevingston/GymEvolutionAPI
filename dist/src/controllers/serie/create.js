"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSerieController = createSerieController;
const prisma_1 = require("lib/prisma");
async function createSerieController(request, reply) {
    try {
        const serie = await prisma_1.prisma.serie.create({
            data: request.body,
        });
        return reply.code(201).send(serie);
    }
    catch (error) {
        throw error;
    }
}
