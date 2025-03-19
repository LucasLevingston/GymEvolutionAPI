"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMealAsCompletedController = void 0;
const client_error_1 = require("errors/client-error");
const get_diet_by_id_1 = require("services/diet/get-diet-by-id");
const create_history_entry_1 = require("services/history/create-history-entry");
const get_meal_by_id_1 = require("services/meal/get-meal-by-id");
const mark_meal_as_completed_1 = require("services/meal/mark-meal-as-completed");
const markMealAsCompletedController = async (request) => {
    const { id } = request.params;
    const { id: userId, role } = request.user;
    const meal = await (0, get_meal_by_id_1.getMealById)(id);
    if (!meal) {
        throw new client_error_1.ClientError('Meal not found.');
    }
    const diet = await (0, get_diet_by_id_1.getDietById)(meal.dietId);
    if (role === 'STUDENT' && diet.userId !== userId) {
        throw new client_error_1.ClientError('Forbidden');
    }
    const updatedMeal = await (0, mark_meal_as_completed_1.markMealAsCompleted)(id);
    if (!updatedMeal || !updatedMeal.Diet) {
        throw new client_error_1.ClientError('Error on mark as completed (Service)');
    }
    await (0, create_history_entry_1.createHistoryEntry)(updatedMeal.Diet.userId, `Meal ${meal.name} marked as completed`);
    return updatedMeal;
};
exports.markMealAsCompletedController = markMealAsCompletedController;
