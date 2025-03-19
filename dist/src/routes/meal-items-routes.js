"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealItemsRoutes = mealItemsRoutes;
const zod_1 = require("zod");
const authenticate_1 = require("../middlewares/authenticate");
const common_schemas_1 = require("../schemas/common-schemas");
const create_1 = require("controllers/meal-items/create");
const get_1 = require("controllers/meal-items/get");
const update_1 = require("controllers/meal-items/update");
const delete_1 = require("controllers/meal-items/delete");
const error_schema_1 = require("schemas/error-schema");
async function mealItemsRoutes(app) {
    const server = app.withTypeProvider();
    // All routes require authentication
    server.addHook('onRequest', authenticate_1.authenticate);
    // Create meal item schema
    const createMealItemSchema = zod_1.z.object({
        name: zod_1.z.string(),
        quantity: zod_1.z.number().int().positive(),
        calories: zod_1.z.number().int().optional(),
        protein: zod_1.z.number().optional(),
        carbohydrates: zod_1.z.number().optional(),
        fat: zod_1.z.number().optional(),
        mealId: zod_1.z.string().uuid(),
    });
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
    server.post('/', {
        schema: {
            body: createMealItemSchema,
            response: {
                201: mealItemResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['meal-items'],
            summary: 'Create meal item',
            description: 'Create a new meal item for a meal',
            security: [{ bearerAuth: [] }],
        },
    }, create_1.createMealItemController);
    // Get meal item by ID schema
    server.get('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: mealItemResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['meal-items'],
            summary: 'Get meal item by ID',
            description: 'Get a meal item by ID',
            security: [{ bearerAuth: [] }],
        },
    }, get_1.getMealItemController);
    // Update meal item schema
    const updateMealItemSchema = zod_1.z.object({
        name: zod_1.z.string().optional(),
        quantity: zod_1.z.number().int().positive().optional(),
        calories: zod_1.z.number().int().optional(),
        protein: zod_1.z.number().optional(),
        carbohydrates: zod_1.z.number().optional(),
        fat: zod_1.z.number().optional(),
    });
    server.put('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            body: updateMealItemSchema,
            response: {
                200: mealItemResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['meal-items'],
            summary: 'Update meal item',
            description: 'Update a meal item by ID',
            security: [{ bearerAuth: [] }],
        },
    }, update_1.updateMealItemController);
    // Delete meal item schema
    const deleteMealItemResponseSchema = zod_1.z.object({
        message: zod_1.z.string(),
    });
    server.delete('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: deleteMealItemResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['meal-items'],
            summary: 'Delete meal item',
            description: 'Delete a meal item by ID',
            security: [{ bearerAuth: [] }],
        },
    }, delete_1.deleteMealItemController);
}
