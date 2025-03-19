"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealRoutes = mealRoutes;
const zod_1 = require("zod");
const authenticate_1 = require("../middlewares/authenticate");
const common_schemas_1 = require("../schemas/common-schemas");
const create_1 = require("controllers/meal/create");
const get_1 = require("controllers/meal/get");
const update_1 = require("controllers/meal/update");
const delete_1 = require("controllers/meal/delete");
const markMealAsCompletedController_1 = require("controllers/meal/markMealAsCompletedController");
const error_schema_1 = require("schemas/error-schema");
async function mealRoutes(app) {
    const server = app.withTypeProvider();
    // All routes require authentication
    server.addHook('onRequest', authenticate_1.authenticate);
    // Create meal schema
    const createMealSchema = zod_1.z.object({
        name: zod_1.z.string(),
        calories: zod_1.z.number().int().optional(),
        protein: zod_1.z.number().optional(),
        carbohydrates: zod_1.z.number().optional(),
        fat: zod_1.z.number().optional(),
        quantity: zod_1.z.string().optional(),
        mealType: zod_1.z.string().optional(),
        day: zod_1.z.number().int().min(1).max(7).optional(),
        hour: zod_1.z.string().optional(),
        dietId: zod_1.z.string().uuid(),
    });
    const mealResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string().nullable(),
        calories: zod_1.z.number().nullable(),
        protein: zod_1.z.number().nullable(),
        carbohydrates: zod_1.z.number().nullable(),
        fat: zod_1.z.number().nullable(),
        mealType: zod_1.z.string().nullable(),
        day: zod_1.z.number().nullable(),
        hour: zod_1.z.string().nullable(),
        isCompleted: zod_1.z.boolean().nullable(),
        dietId: zod_1.z.string().uuid().nullable(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
    });
    server.post('/', {
        schema: {
            body: createMealSchema,
            response: {
                201: mealResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['meals'],
            summary: 'Create meal',
            description: 'Create a new meal for a diet',
            security: [{ bearerAuth: [] }],
        },
    }, create_1.createMealController);
    // Get meal by ID schema
    const mealItemResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string(),
        quantity: zod_1.z.number(),
        calories: zod_1.z.number().nullable(),
        protein: zod_1.z.number().nullable(),
        carbohydrates: zod_1.z.number().nullable(),
        fat: zod_1.z.number().nullable(),
        mealId: zod_1.z.string().uuid().nullable(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
    });
    const getMealByIdResponseSchema = mealResponseSchema.extend({
        mealItems: zod_1.z.array(mealItemResponseSchema),
    });
    server.get('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: getMealByIdResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['meals'],
            summary: 'Get meal by ID',
            description: 'Get a meal by ID',
            security: [{ bearerAuth: [] }],
        },
    }, get_1.getMealController);
    // Update meal schema
    const updateMealSchema = zod_1.z.object({
        name: zod_1.z.string().optional(),
        calories: zod_1.z.number().int().optional(),
        protein: zod_1.z.number().optional(),
        carbohydrates: zod_1.z.number().optional(),
        fat: zod_1.z.number().optional(),
        quantity: zod_1.z.string().optional(),
        mealType: zod_1.z.string().optional(),
        day: zod_1.z.number().int().min(1).max(7).optional(),
        hour: zod_1.z.string().optional(),
    });
    server.put('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            body: updateMealSchema,
            response: {
                200: mealResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['meals'],
            summary: 'Update meal',
            description: 'Update a meal by ID',
            security: [{ bearerAuth: [] }],
        },
    }, update_1.updateMealController);
    // Delete meal schema
    const deleteMealResponseSchema = zod_1.z.object({
        message: zod_1.z.string(),
    });
    server.delete('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: deleteMealResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['meals'],
            summary: 'Delete meal',
            description: 'Delete a meal by ID',
            security: [{ bearerAuth: [] }],
        },
    }, delete_1.deleteMealController);
    // Mark meal as completed schema
    server.patch('/:id/complete', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: mealResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['meals'],
            summary: 'Mark meal as completed',
            description: 'Mark a meal as completed by ID',
            security: [{ bearerAuth: [] }],
        },
    }, markMealAsCompletedController_1.markMealAsCompletedController);
}
