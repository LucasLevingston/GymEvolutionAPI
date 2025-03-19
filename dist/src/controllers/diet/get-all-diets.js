"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDietsController = getAllDietsController;
const get_all_diets_1 = require("../../services/diet/get-all-diets");
const is_professional_assigned_to_student_1 = require("../../services/training-week/is-professional-assigned-to-student");
async function getAllDietsController(request, reply) {
    const { userId, role } = request.user;
    const { studentId } = request.query;
    // Determine the target user ID
    let targetUserId = userId;
    // If a nutritionist is viewing a student's diets
    if (role === 'NUTRITIONIST' && studentId) {
        // Check if the nutritionist is assigned to this student
        const isAssigned = await (0, is_professional_assigned_to_student_1.isProfessionalAssignedToStudent)(userId, studentId, 'NUTRITIONIST');
        if (!isAssigned) {
            return reply.status(403).send({ message: 'You are not assigned to this student' });
        }
        targetUserId = studentId;
    }
    else if (studentId && role === 'STUDENT') {
        return reply.status(403).send({ message: 'Students can only view their own diets' });
    }
    const diets = await (0, get_all_diets_1.getAllDiets)(targetUserId);
    return reply.send(diets);
}
