"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProfessionalAssignedToStudent = isProfessionalAssignedToStudent;
const prisma_1 = require("../../lib/prisma");
const is_trainer_assigned_to_student_1 = require("./is-trainer-assigned-to-student");
async function isProfessionalAssignedToStudent(professionalId, studentId, role) {
    if (role === 'TRAINER') {
        return (0, is_trainer_assigned_to_student_1.isTrainerAssignedToStudent)(professionalId, studentId);
    }
    else if (role === 'NUTRITIONIST') {
        const relationship = await prisma_1.prisma.relationship.findFirst({
            where: {
                nutritionistId: professionalId,
                studentId,
                status: 'ACTIVE',
            },
        });
        return !!relationship;
    }
    return false;
}
