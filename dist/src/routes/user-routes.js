"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const zod_1 = require("zod");
const authenticate_1 = require("../middlewares/authenticate");
const get_all_users_1 = require("../controllers/user/get-all-users");
const get_user_by_id_1 = require("../controllers/user/get-user-by-id");
const update_user_1 = require("../controllers/user/update-user");
const delete_user_1 = require("../controllers/user/delete-user");
const get_all_nutritionists_1 = require("../controllers/user/get-all-nutritionists");
const get_all_trainers_1 = require("../controllers/user/get-all-trainers");
const assign_nutritionist_1 = require("../controllers/user/assign-nutritionist");
const assign_trainer_1 = require("../controllers/user/assign-trainer");
const get_nutritionist_students_1 = require("../controllers/user/get-nutritionist-students");
const get_trainer_students_1 = require("../controllers/user/get-trainer-students");
const common_schemas_1 = require("../schemas/common-schemas");
const userSchema_1 = require("schemas/userSchema");
const error_schema_1 = require("schemas/error-schema");
async function userRoutes(app) {
    const server = app.withTypeProvider();
    server.addHook('onRequest', authenticate_1.authenticate);
    const getAllUsersResponseSchema = zod_1.z.array(userSchema_1.userResponseSchema);
    server.get('/', {
        schema: {
            response: {
                200: getAllUsersResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Get all users',
            description: 'Get all users (admin only)',
            security: [{ bearerAuth: [] }],
        },
    }, get_all_users_1.getAllUsersController);
    const getUserByIdResponseSchema = userSchema_1.userResponseSchema.extend({
        sex: zod_1.z.string().nullable(),
        birthDate: zod_1.z.string().nullable(),
        phone: zod_1.z.string().nullable(),
        currentWeight: zod_1.z.string().nullable(),
        city: zod_1.z.string().nullable(),
        state: zod_1.z.string().nullable(),
    });
    server.get('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: userSchema_1.userSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Get user by ID',
            description: 'Get a user by ID',
            security: [{ bearerAuth: [] }],
        },
    }, get_user_by_id_1.getUserByIdController);
    server.put('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            body: zod_1.z.any(),
            response: {
                200: userSchema_1.userSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Update user',
            description: 'Update a user by ID',
            security: [{ bearerAuth: [] }],
        },
    }, update_user_1.updateUserController);
    const deleteUserResponseSchema = zod_1.z.object({
        message: zod_1.z.string(),
    });
    server.delete('/:id', {
        schema: {
            params: common_schemas_1.idParamSchema,
            response: {
                200: deleteUserResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Delete user',
            description: 'Delete a user by ID (admin only)',
            security: [{ bearerAuth: [] }],
        },
    }, delete_user_1.deleteUserController);
    // Get all nutritionists schema
    const getNutritionistsResponseSchema = zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string().nullable(),
        email: zod_1.z.string().email(),
    }));
    server.get('/role/nutritionists', {
        schema: {
            response: {
                200: getNutritionistsResponseSchema,
                401: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Get all nutritionists',
            description: 'Get all users with the nutritionist role',
            security: [{ bearerAuth: [] }],
        },
    }, get_all_nutritionists_1.getAllNutritionistsController);
    // Get all trainers schema
    const getTrainersResponseSchema = zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string().nullable(),
        email: zod_1.z.string().email(),
    }));
    server.get('/role/trainers', {
        schema: {
            response: {
                200: getTrainersResponseSchema,
                401: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Get all trainers',
            description: 'Get all users with the trainer role',
            security: [{ bearerAuth: [] }],
        },
    }, get_all_trainers_1.getAllTrainersController);
    // Assign nutritionist schema
    const assignNutritionistSchema = zod_1.z.object({
        studentId: zod_1.z.string().uuid(),
        nutritionistId: zod_1.z.string().uuid(),
    });
    const relationshipResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        nutritionistId: zod_1.z.string().uuid().nullable(),
        studentId: zod_1.z.string().uuid().nullable(),
        status: zod_1.z.string(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
    });
    server.post('/assign/nutritionist', {
        schema: {
            body: assignNutritionistSchema,
            response: {
                201: relationshipResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Assign nutritionist to student',
            description: 'Assign a nutritionist to a student',
            security: [{ bearerAuth: [] }],
        },
    }, assign_nutritionist_1.assignNutritionistController);
    // Assign trainer schema
    const assignTrainerSchema = zod_1.z.object({
        studentId: zod_1.z.string().uuid(),
        trainerId: zod_1.z.string().uuid(),
    });
    server.post('/assign/trainer', {
        schema: {
            body: assignTrainerSchema,
            response: {
                201: relationshipResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Assign trainer to student',
            description: 'Assign a trainer to a student',
            security: [{ bearerAuth: [] }],
        },
    }, assign_trainer_1.assignTrainerController);
    // Get nutritionist students schema
    const getStudentsResponseSchema = zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string().nullable(),
        email: zod_1.z.string().email(),
        sex: zod_1.z.string().nullable(),
        birthDate: zod_1.z.string().nullable(),
        currentWeight: zod_1.z.string().nullable(),
    }));
    server.get('/nutritionist/students', {
        schema: {
            response: {
                200: getStudentsResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Get nutritionist students',
            description: 'Get all students assigned to the current nutritionist',
            security: [{ bearerAuth: [] }],
        },
    }, get_nutritionist_students_1.getNutritionistStudentsController);
    // Get trainer students schema
    server.get('/trainer/students', {
        schema: {
            response: {
                200: getStudentsResponseSchema,
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['users'],
            summary: 'Get trainer students',
            description: 'Get all students assigned to the current trainer',
            security: [{ bearerAuth: [] }],
        },
    }, get_trainer_students_1.getTrainerStudentsController);
}
