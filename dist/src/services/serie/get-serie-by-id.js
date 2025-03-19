"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSerieById = getSerieById;
const prisma_1 = require("../../lib/prisma");
const client_error_1 = require("../../errors/client-error");
async function getSerieById(id) {
    const serie = await prisma_1.prisma.serie.findUnique({
        where: { id },
    });
    if (!serie) {
        throw new client_error_1.ClientError('Serie not found');
    }
    return serie;
}
