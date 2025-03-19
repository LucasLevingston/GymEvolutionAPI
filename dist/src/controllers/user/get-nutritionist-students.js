"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNutritionistStudentsController = getNutritionistStudentsController;
const get_nutritionist_students_1 = require("../../services/user/get-nutritionist-students");
async function getNutritionistStudentsController(request, reply) {
    const { id: nutritionistId, role } = request.user;
    if (role !== 'NUTRITIONIST') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    const students = await (0, get_nutritionist_students_1.getNutritionistStudents)(nutritionistId);
    return reply.send(students);
}
