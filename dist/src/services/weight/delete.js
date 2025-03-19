"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWeightService = void 0;
const prisma_1 = require("lib/prisma");
const deleteWeightService = async (id) => {
    await prisma_1.prisma.weight.delete({ where: { id } });
};
exports.deleteWeightService = deleteWeightService;
