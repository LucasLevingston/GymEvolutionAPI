"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainerStudents = getTrainerStudents;
const prisma_1 = require("../../lib/prisma");
async function getTrainerStudents(trainerId) {
    const relationships = await prisma_1.prisma.relationship.findMany({
        where: {
            trainerId,
            status: 'ACTIVE',
        },
        include: {
            student2: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    sex: true,
                    birthDate: true,
                    currentWeight: true,
                },
            },
        },
    });
    return relationships
        .map(rel => rel.student2)
        .filter(student => student !== null);
}
