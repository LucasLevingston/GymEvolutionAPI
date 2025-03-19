"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignNutritionistController = assignNutritionistController;
const assign_nutritionist_1 = require("../../services/user/assign-nutritionist");
async function assignNutritionistController(request, reply) {
    const { role } = request.user;
    const { studentId, nutritionistId } = request.body;
    // Only nutritionists or admins can assign nutritionists
    if (role !== 'NUTRITIONIST' && role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    const relationship = await (0, assign_nutritionist_1.assignNutritionist)(nutritionistId, studentId);
    return reply.status(201).send(relationship);
}
