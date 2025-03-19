"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWeightRecord = addWeightRecord;
const prisma_1 = require("../../lib/prisma");
async function addWeightRecord({ weight, bf, date, userId, }) {
    const weightRecord = await prisma_1.prisma.weight.create({
        data: {
            weight,
            bf,
            date,
            userId,
        },
    });
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: {
            currentWeight: weight,
            currentBf: bf,
        },
    });
    return weightRecord;
}
