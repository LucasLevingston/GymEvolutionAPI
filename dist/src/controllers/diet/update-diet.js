"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDietController = updateDietController;
const get_diet_by_id_1 = require("../../services/diet/get-diet-by-id");
const update_diet_1 = require("../../services/diet/update-diet");
const is_professional_assigned_to_student_1 = require("../../services/training-week/is-professional-assigned-to-student");
const client_error_1 = require("errors/client-error");
async function updateDietController(request, reply) {
    try {
        const { id } = request.params;
        const { id: userId, role } = request.user;
        const updateData = request.body;
        const diet = await (0, get_diet_by_id_1.getDietById)(id);
        if (!diet) {
            throw new client_error_1.ClientError('Diet not found');
        }
        if (role === 'NUTRITIONIST' && diet.userId !== userId) {
            const isAssigned = await (0, is_professional_assigned_to_student_1.isProfessionalAssignedToStudent)(userId, diet.userId, 'NUTRITIONIST');
            if (!isAssigned) {
                throw new client_error_1.ClientError('You are not assigned to this student');
            }
        }
        else if (role !== 'NUTRITIONIST' && role !== 'ADMIN' && diet.userId !== userId) {
            throw new client_error_1.ClientError('Forbidden');
        }
        const preparedData = {
            ...diet,
            ...updateData,
            id,
            meals: Array.isArray(updateData.meals) ? updateData.meals : [],
        };
        const updatedDiet = await (0, update_diet_1.updateDiet)(id, preparedData);
        return reply.send(updatedDiet);
    }
    catch (error) {
        throw error;
    }
}
