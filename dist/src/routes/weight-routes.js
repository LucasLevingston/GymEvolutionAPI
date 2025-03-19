"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightRoutes = weightRoutes;
const zod_1 = require("zod");
const authenticate_1 = require("../middlewares/authenticate");
const error_schema_1 = require("../schemas/error-schema");
const addWeightRecord_1 = require("controllers/weight/addWeightRecord");
const get_1 = require("controllers/weight/get");
const delete_1 = require("controllers/weight/delete");
async function weightRoutes(app) {
    const server = app.withTypeProvider();
    server.addHook('onRequest', authenticate_1.authenticate);
    const addWeightRecordSchema = zod_1.z.object({
        weight: zod_1.z.string(),
        bf: zod_1.z.string().optional().default('0'),
        date: zod_1.z
            .string()
            .optional()
            .default(() => new Date().toISOString()),
        studentId: zod_1.z.string().uuid().optional(),
    });
    const weightResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        weight: zod_1.z.string(),
        bf: zod_1.z.string(),
        date: zod_1.z.string(),
        userId: zod_1.z.string(),
        createdAt: zod_1.z.date(),
    });
    server.post('/', {
        schema: {
            body: addWeightRecordSchema,
            response: {
                201: weightResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['weight'],
            summary: 'Add weight record',
            description: 'Add a weight record for a user',
            security: [{ bearerAuth: [] }],
        },
    }, addWeightRecord_1.addWeightRecordController);
    const getWeightHistoryQuerySchema = zod_1.z.object({
        studentId: zod_1.z.string().uuid().optional(),
    });
    server.get('/', {
        schema: {
            querystring: getWeightHistoryQuerySchema,
            response: {
                200: zod_1.z.array(weightResponseSchema),
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['weight'],
            summary: 'Get weight history',
            description: 'Get weight history for a user',
            security: [{ bearerAuth: [] }],
        },
    }, get_1.getWeightController);
    server.delete('/:id', {
        schema: {
            summary: 'Delete a weight entry',
            description: 'This endpoint allows deletion of a weight entry.',
            tags: ['Weights'],
            params: zod_1.z.object({
                id: zod_1.z.string().uuid(),
            }),
            response: {
                200: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
                404: zod_1.z.object({
                    error: zod_1.z.string(),
                }),
                500: zod_1.z.object({
                    error: zod_1.z.string(),
                }),
            },
            security: [{ bearerAuth: [] }],
        },
    }, delete_1.deleteWeightController);
}
