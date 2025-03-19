"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealItemsSchema = void 0;
const zod_1 = require("zod");
exports.mealItemsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().optional(),
    quantity: zod_1.z.number().int().positive().optional(),
    calories: zod_1.z.number().int().positive().optional().nullable(),
    protein: zod_1.z.number().positive().optional().nullable(),
    carbohydrates: zod_1.z.number().positive().optional().nullable().nullable(),
});
