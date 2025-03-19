"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainingWeekRoutes = trainingWeekRoutes;
const zod_1 = require("zod");
const authenticate_1 = require("../middlewares/authenticate");
const common_schemas_1 = require("../schemas/common-schemas");
const create_training_week_1 = require("controllers/training-week/create-training-week");
const get_all_training_weeks_1 = require("controllers/training-week/get-all-training-weeks");
const get_training_week_by_id_1 = require("controllers/training-week/get-training-week-by-id");
const update_training_week_1 = require("controllers/training-week/update-training-week");
const delete_training_week_1 = require("controllers/training-week/delete-training-week");
const error_schema_1 = require("schemas/error-schema");
async function trainingWeekRoutes(app) {
    const server = app.withTypeProvider();
    server.addHook('onRequest', authenticate_1.authenticate);
    const createExerciseSchema = zod_1.z.object({
        name: zod_1.z.string(),
        variation: zod_1.z.string().optional(),
        repetitions: zod_1.z.number().int().positive(),
        sets: zod_1.z.number().int().positive(),
        done: zod_1.z.boolean().default(false),
    });
    // Create training day schema
    const createTrainingDaySchema = zod_1.z.object({
        group: zod_1.z.string(),
        dayOfWeek: zod_1.z.string(),
        comments: zod_1.z.string().optional(),
        done: zod_1.z.boolean().default(false),
        exercises: zod_1.z.array(createExerciseSchema).optional(),
    });
    // Create training week schema
    const createTrainingWeekSchema = zod_1.z.object({
        weekNumber: zod_1.z.number().int().positive(),
        information: zod_1.z.string().optional(),
        studentId: zod_1.z.string().uuid().optional(),
        trainingDays: zod_1.z.array(createTrainingDaySchema).optional(),
    });
    const trainingWeekResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        weekNumber: zod_1.z.number(),
        information: zod_1.z.string().nullable(),
        current: zod_1.z.boolean(),
        done: zod_1.z.boolean(),
        userId: zod_1.z.string().uuid(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
    });
    server.post('/', {
        schema: {
            body: createTrainingWeekSchema,
            response: {
                201: trainingWeekResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                409: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['training'],
            summary: 'Create training week',
            description: 'Create a new training week for a user',
            security: [{ bearerAuth: [] }],
        },
    }, create_training_week_1.createTrainingWeekController);
    // Get all training weeks schema
    const getAllTrainingWeeksQuerySchema = zod_1.z.object({
        studentId: zod_1.z.string().uuid().optional(),
    });
    const trainingDayResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        group: zod_1.z.string(),
        dayOfWeek: zod_1.z.string(),
        done: zod_1.z.boolean(),
        comments: zod_1.z.string().nullable(),
        trainingWeekId: zod_1.z.string().uuid(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
    });
    const getAllTrainingWeeksResponseSchema = zod_1.z.array(trainingWeekResponseSchema.extend({
        trainingDays: zod_1.z.array(trainingDayResponseSchema),
    }));
    server.get('/', {
        schema: {
            querystring: getAllTrainingWeeksQuerySchema,
            response: {
                200: getAllTrainingWeeksResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['training'],
            summary: 'Get all training weeks',
            description: 'Get all training weeks for a user',
            security: [{ bearerAuth: [] }],
        },
    }, get_all_training_weeks_1.getAllTrainingWeeksController);
    // Get training week by ID schema
    const serieResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        seriesIndex: zod_1.z.number().nullable(),
        repetitions: zod_1.z.number().nullable(),
        weight: zod_1.z.number().nullable(),
        exerciseId: zod_1.z.string().uuid(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
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
        seriesResults: zod_1.z.array(serieResponseSchema),
    });
    const getTrainingWeekByIdResponseSchema = trainingWeekResponseSchema.extend({
        trainingDays: zod_1.z.array(trainingDayResponseSchema.extend({
            exercises: zod_1.z.array(exerciseResponseSchema),
        })),
        user: zod_1.z.object({
            id: zod_1.z.string().uuid(),
            name: zod_1.z.string().nullable(),
        }),
    });
    server.get('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: getTrainingWeekByIdResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['training'],
            summary: 'Get training week by ID',
            description: 'Get a training week by ID',
            security: [{ bearerAuth: [] }],
        },
    }, get_training_week_by_id_1.getTrainingWeekByIdController);
    const updateTrainingWeekSchema = zod_1.z.object({
        weekNumber: zod_1.z.number().int().positive().optional(),
        information: zod_1.z.string().optional(),
        current: zod_1.z.boolean().optional(),
        done: zod_1.z.boolean().optional(),
    });
    server.put('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            body: updateTrainingWeekSchema,
            response: {
                200: trainingWeekResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['training'],
            summary: 'Update training week',
            description: 'Update a training week by ID',
            security: [{ bearerAuth: [] }],
        },
    }, update_training_week_1.updateTrainingWeekController);
    const deleteTrainingWeekResponseSchema = zod_1.z.object({
        message: zod_1.z.string(),
    });
    server.delete('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: deleteTrainingWeekResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['training'],
            summary: 'Delete training week',
            description: 'Delete a training week by ID',
            security: [{ bearerAuth: [] }],
        },
    }, delete_training_week_1.deleteTrainingWeekController);
}
