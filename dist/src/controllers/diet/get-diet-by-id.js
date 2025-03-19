"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDietByIdController = getDietByIdController;
const get_diet_by_id_1 = require("../../services/diet/get-diet-by-id");
const is_professional_assigned_to_student_1 = require("../../services/training-week/is-professional-assigned-to-student");
async function getDietByIdController(request, reply) {
    const { id } = request.params;
    const { id: userId, role } = request.user;
    const diet = await (0, get_diet_by_id_1.getDietById)(id);
    // Check if the user has access to this diet
    if (diet.userId !== userId && role === 'STUDENT') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    // If a nutritionist is trying to access a student's diet
    if (role === 'NUTRITIONIST' && diet.userId !== userId) {
        // Check if the nutritionist is assigned to this student
        const isAssigned = await (0, is_professional_assigned_to_student_1.isProfessionalAssignedToStudent)(userId, diet.userId, 'NUTRITIONIST');
        if (!isAssigned) {
            return reply.status(403).send({ message: 'You are not assigned to this student' });
        }
    }
    return reply.send(diet);
}
