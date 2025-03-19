"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNutritionistStudents = getNutritionistStudents;
const prisma_1 = require("../../lib/prisma");
async function getNutritionistStudents(nutritionistId) {
    const relationships = await prisma_1.prisma.relationship.findMany({
        where: {
            nutritionistId,
            status: 'ACTIVE',
        },
        include: {
            student: {
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
        .map(rel => rel.student)
        .filter(student => student !== null);
}
