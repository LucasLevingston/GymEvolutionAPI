"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDietController = deleteDietController;
const get_diet_by_id_1 = require("../../services/diet/get-diet-by-id");
const delete_diet_1 = require("../../services/diet/delete-diet");
const is_professional_assigned_to_student_1 = require("../../services/training-week/is-professional-assigned-to-student");
async function deleteDietController(request, reply) {
    const { id } = request.params;
    const { id: userId, role } = request.user;
    const diet = await (0, get_diet_by_id_1.getDietById)(id);
    // Only nutritionists can delete diets
    if (role !== 'NUTRITIONIST' && role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    // If a nutritionist is trying to delete a student's diet
    if (role === 'NUTRITIONIST' && diet.userId !== userId) {
        // Check if the nutritionist is assigned to this student
        const isAssigned = await (0, is_professional_assigned_to_student_1.isProfessionalAssignedToStudent)(userId, diet.userId, 'NUTRITIONIST');
        if (!isAssigned) {
            return reply.status(403).send({ message: 'You are not assigned to this student' });
        }
    }
    await (0, delete_diet_1.deleteDiet)(id);
    return reply.send({ message: 'Diet deleted successfully' });
}
