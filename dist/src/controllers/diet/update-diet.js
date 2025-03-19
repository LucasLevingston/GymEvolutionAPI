"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDietController = updateDietController;
const get_diet_by_id_1 = require("../../services/diet/get-diet-by-id");
const update_diet_1 = require("../../services/diet/update-diet");
const is_professional_assigned_to_student_1 = require("../../services/training-week/is-professional-assigned-to-student");
async function updateDietController(request, reply) {
    const { id } = request.params;
    const { userId, role } = request.user;
    const updateData = request.body;
    const diet = await (0, get_diet_by_id_1.getDietById)(id);
    // Only nutritionists can update diets
    if (role !== 'NUTRITIONIST' && role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    // If a nutritionist is trying to update a student's diet
    if (role === 'NUTRITIONIST' && diet.userId !== userId) {
        // Check if the nutritionist is assigned to this student
        const isAssigned = await (0, is_professional_assigned_to_student_1.isProfessionalAssignedToStudent)(userId, diet.userId, 'NUTRITIONIST');
        if (!isAssigned) {
            return reply.status(403).send({ message: 'You are not assigned to this student' });
        }
    }
    const updatedDiet = await (0, update_diet_1.updateDiet)(id, updateData);
    return reply.send(updatedDiet);
}
