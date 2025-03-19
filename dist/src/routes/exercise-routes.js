"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseRoutes = exerciseRoutes;
const zod_1 = require("zod");
const authenticate_1 = require("../middlewares/authenticate");
const error_schema_1 = require("../schemas/error-schema");
const create_1 = require("controllers/exercise/create");
const update_1 = require("controllers/exercise/update");
const delete_1 = require("controllers/exercise/delete");
const markExerciseAsDoneController_1 = require("controllers/exercise/markExerciseAsDoneController");
const common_schemas_1 = require("schemas/common-schemas");
async function exerciseRoutes(app) {
    const server = app.withTypeProvider();
    server.addHook('onRequest', authenticate_1.authenticate);
    const createExerciseSchema = zod_1.z.object({
        name: zod_1.z.string(),
        variation: zod_1.z.string().optional().nullable(),
        repetitions: zod_1.z.number().int().positive(),
        sets: zod_1.z.number().int().positive(),
        trainingDayId: zod_1.z.string().uuid(),
    });
    const exerciseResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string(),
        variation: zod_1.z.string().nullable(),
        repetitions: zod_1.z.number(),
        sets: zod_1.z.number(),
        done: zod_1.z.boolean(),
        trainingDayId: zod_1.z.string().uuid(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
    });
    server.post('/', {
        schema: {
            body: createExerciseSchema,
            response: {
                201: exerciseResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['exercises'],
            summary: 'Create exercise',
            description: 'Create a new exercise for a training day',
            security: [{ bearerAuth: [] }],
        },
    }, create_1.createExerciseController);
    // Get exercise by ID schema
    const serieResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        seriesIndex: zod_1.z.number().nullable(),
        repetitions: zod_1.z.number().nullable(),
        weight: zod_1.z.number().nullable(),
        exerciseId: zod_1.z.string().uuid(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
    });
    const getExerciseByIdResponseSchema = exerciseResponseSchema.extend({
        seriesResults: zod_1.z.array(serieResponseSchema),
    });
    // Update exercise schema
    const updateExerciseSchema = zod_1.z.object({
        name: zod_1.z.string().optional(),
        variation: zod_1.z.string().optional().nullable(),
        repetitions: zod_1.z.number().int().positive().optional(),
        sets: zod_1.z.number().int().positive().optional(),
    });
    server.put('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            body: updateExerciseSchema,
            response: {
                200: exerciseResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['exercises'],
            summary: 'Update exercise',
            description: 'Update an exercise by ID',
            security: [{ bearerAuth: [] }],
        },
    }, update_1.updateExerciseController);
    // Delete exercise schema
    const deleteExerciseResponseSchema = zod_1.z.object({
        message: zod_1.z.string(),
    });
    server.delete('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: deleteExerciseResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['exercises'],
            summary: 'Delete exercise',
            description: 'Delete an exercise by ID',
            security: [{ bearerAuth: [] }],
        },
    }, delete_1.deleteExerciseController);
    server.patch('/:id/done', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: exerciseResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['exercises'],
            summary: 'Mark exercise as done',
            description: 'Mark an exercise as done by ID',
            security: [{ bearerAuth: [] }],
        },
    }, markExerciseAsDoneController_1.markExerciseAsDoneController);
}
