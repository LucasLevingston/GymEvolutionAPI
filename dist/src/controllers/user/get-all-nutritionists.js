"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNutritionistsController = getAllNutritionistsController;
const get_all_nutritionists_1 = require("../../services/user/get-all-nutritionists");
async function getAllNutritionistsController() {
    try {
        const nutritionists = await (0, get_all_nutritionists_1.getAllNutritionists)();
        return nutritionists;
    }
    catch (error) {
        throw error;
    }
}
