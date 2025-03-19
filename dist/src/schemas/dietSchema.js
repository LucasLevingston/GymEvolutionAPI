"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dietSchema = void 0;
const zod_1 = require("zod");
const mealSchema_1 = require("./mealSchema");
exports.dietSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    weekNumber: zod_1.z.number().int().positive().optional(),
    totalCalories: zod_1.z.number().int().positive().optional().nullable(),
    totalProtein: zod_1.z.number().positive().optional().nullable(),
    totalCarbohydrates: zod_1.z.number().positive().optional().nullable(),
    totalFat: zod_1.z.number().positive().optional().nullable(),
    isCurrent: zod_1.z.boolean().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
    userId: zod_1.z.string().uuid().optional().nullable(),
    meals: zod_1.z.array(mealSchema_1.mealSchema).optional(),
});
