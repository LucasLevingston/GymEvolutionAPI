"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDietController = createDietController;
const create_diet_1 = require("../../services/diet/create-diet");
const is_professional_assigned_to_student_1 = require("../../services/training-week/is-professional-assigned-to-student");
async function createDietController(request, reply) {
    const { id: userId, role } = request.user;
    const dietData = request.body;
    let targetUserId = userId;
    try {
        if (role === 'NUTRITIONIST' && dietData.studentId) {
            const isAssigned = await (0, is_professional_assigned_to_student_1.isProfessionalAssignedToStudent)(userId, dietData.studentId, 'NUTRITIONIST');
            if (!isAssigned) {
                return reply
                    .status(403)
                    .send({ message: 'You are not assigned to this student' });
            }
            targetUserId = dietData.studentId;
        }
        else if (dietData.studentId && role !== 'NUTRITIONIST') {
            return reply
                .status(403)
                .send({ message: 'Only nutritionists can create diets for students' });
        }
        const diet = await (0, create_diet_1.createDiet)({
            ...dietData,
            userId: targetUserId,
        });
        return diet;
    }
    catch (error) {
        throw error;
    }
}
