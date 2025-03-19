"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dietRoutes = dietRoutes;
const zod_1 = require("zod");
const authenticate_1 = require("../middlewares/authenticate");
const common_schemas_1 = require("../schemas/common-schemas");
const create_diet_1 = require("controllers/diet/create-diet");
const get_all_diets_1 = require("controllers/diet/get-all-diets");
const get_diet_by_id_1 = require("controllers/diet/get-diet-by-id");
const update_diet_1 = require("controllers/diet/update-diet");
const delete_diet_1 = require("controllers/diet/delete-diet");
const error_schema_1 = require("schemas/error-schema");
async function dietRoutes(app) {
    const server = app.withTypeProvider();
    server.addHook('onRequest', authenticate_1.authenticate);
    const createDietSchema = zod_1.z.object({
        weekNumber: zod_1.z.number().int().positive(),
        totalCalories: zod_1.z.number().int().optional(),
        totalProtein: zod_1.z.number().optional(),
        totalCarbohydrates: zod_1.z.number().optional(),
        totalFat: zod_1.z.number().optional(),
        studentId: zod_1.z.string().uuid().optional(),
    });
    const dietResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        weekNumber: zod_1.z.number(),
        totalCalories: zod_1.z.number().nullable(),
        totalProtein: zod_1.z.number().nullable(),
        totalCarbohydrates: zod_1.z.number().nullable(),
        totalFat: zod_1.z.number().nullable(),
        userId: zod_1.z.string().uuid().nullable(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
    });
    server.post('/', {
        schema: {
            body: createDietSchema,
            response: {
                201: dietResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                409: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['diet'],
            summary: 'Create diet',
            description: 'Create a new diet for a user',
            security: [{ bearerAuth: [] }],
        },
    }, create_diet_1.createDietController);
    const getAllDietsQuerySchema = zod_1.z.object({
        studentId: zod_1.z.string().uuid().optional(),
    });
    const mealResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string().nullable(),
        calories: zod_1.z.number().nullable(),
        protein: zod_1.z.number().nullable(),
        carbohydrates: zod_1.z.number().nullable(),
        fat: zod_1.z.number().nullable(),
        servingSize: zod_1.z.string().nullable(),
        mealType: zod_1.z.string().nullable(),
        day: zod_1.z.number().nullable(),
        hour: zod_1.z.string().nullable(),
        isCompleted: zod_1.z.boolean().nullable(),
        dietId: zod_1.z.string().uuid().nullable(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
    });
    const getAllDietsResponseSchema = zod_1.z.array(dietResponseSchema.extend({
        meals: zod_1.z.array(mealResponseSchema),
    }));
    server.get('/', {
        schema: {
            querystring: getAllDietsQuerySchema,
            response: {
                200: getAllDietsResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['diet'],
            summary: 'Get all diets',
            description: 'Get all diets for a user',
            security: [{ bearerAuth: [] }],
        },
    }, get_all_diets_1.getAllDietsController);
    // Get diet by ID schema
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
    const getDietByIdResponseSchema = dietResponseSchema.extend({
        meals: zod_1.z.array(mealResponseSchema.extend({
            mealItems: zod_1.z.array(mealItemResponseSchema),
        })),
        User: zod_1.z
            .object({
            id: zod_1.z.string().uuid(),
            name: zod_1.z.string().nullable(),
        })
            .nullable(),
    });
    server.get('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: getDietByIdResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['diet'],
            summary: 'Get diet by ID',
            description: 'Get a diet by ID',
            security: [{ bearerAuth: [] }],
        },
    }, get_diet_by_id_1.getDietByIdController);
    const updateDietSchema = zod_1.z.object({
        weekNumber: zod_1.z.number().int().positive().optional(),
        totalCalories: zod_1.z.number().int().optional(),
        totalProtein: zod_1.z.number().optional(),
        totalCarbohydrates: zod_1.z.number().optional(),
        totalFat: zod_1.z.number().optional(),
    });
    server.put('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            body: updateDietSchema,
            response: {
                200: dietResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['diet'],
            summary: 'Update diet',
            description: 'Update a diet by ID',
            security: [{ bearerAuth: [] }],
        },
    }, update_diet_1.updateDietController);
    const deleteDietResponseSchema = zod_1.z.object({
        message: zod_1.z.string(),
    });
    server.delete('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: deleteDietResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['diet'],
            summary: 'Delete diet',
            description: 'Delete a diet by ID',
            security: [{ bearerAuth: [] }],
        },
    }, delete_diet_1.deleteDietController);
}
