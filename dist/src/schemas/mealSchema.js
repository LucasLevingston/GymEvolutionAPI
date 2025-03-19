"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealSchema = void 0;
const zod_1 = require("zod");
const mealItemsSchema_1 = require("./mealItemsSchema");
exports.mealSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().optional().nullable(),
    calories: zod_1.z.number().int().positive().optional().nullable(),
    protein: zod_1.z.number().positive().optional().nullable(),
    carbohydrates: zod_1.z.number().positive().optional().nullable().nullable(),
    fat: zod_1.z.number().positive().optional().nullable(),
    servingSize: zod_1.z.string().optional().nullable(),
    mealType: zod_1.z.string().optional().nullable(),
    day: zod_1.z.number().int().positive().optional().nullable(),
    hour: zod_1.z.string().optional().nullable(),
    isCompleted: zod_1.z.boolean().optional().nullable(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
    mealItems: zod_1.z.array(mealItemsSchema_1.mealItemsSchema).optional(),
});
