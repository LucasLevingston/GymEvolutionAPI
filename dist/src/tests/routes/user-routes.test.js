"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const user_routes_1 = require("../../routes/user-routes");
const services_1 = require("../mocks/services");
const get_all_users_1 = require("controllers/user/get-all-users");
const get_user_by_id_1 = require("controllers/user/get-user-by-id");
const update_user_1 = require("controllers/user/update-user");
const delete_user_1 = require("controllers/user/delete-user");
const get_all_nutritionists_1 = require("controllers/user/get-all-nutritionists");
const get_all_trainers_1 = require("controllers/user/get-all-trainers");
const assign_nutritionist_1 = require("controllers/user/assign-nutritionist");
const assign_trainer_1 = require("controllers/user/assign-trainer");
const get_nutritionist_students_1 = require("controllers/user/get-nutritionist-students");
const get_trainer_students_1 = require("controllers/user/get-trainer-students");
vitest_1.vi.mock('../../controllers/user-controller', () => {
    return {
        UserController: vitest_1.vi.fn().mockImplementation(() => ({
            getAllUsers: vitest_1.vi.fn(),
            getUserById: vitest_1.vi.fn(),
            updateUser: vitest_1.vi.fn(),
            deleteUser: vitest_1.vi.fn(),
            getAllNutritionists: vitest_1.vi.fn(),
            getAllTrainers: vitest_1.vi.fn(),
            assignNutritionist: vitest_1.vi.fn(),
            assignTrainer: vitest_1.vi.fn(),
            getNutritionistStudents: vitest_1.vi.fn(),
            getTrainerStudents: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('User Routes', () => {
    let server;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        // Mock JWT verification
        server.jwt.verify = vitest_1.vi.fn().mockReturnValue({ id: 'user-id', role: 'ADMIN' });
        await server.register(user_routes_1.userRoutes);
        // Get the mocked controller instance
        // Set up the mock implementations
        get_all_users_1.getAllUsersController.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockUserService.getAllUsers());
        });
        get_user_by_id_1.getUserByIdController.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockUserService.getUserById());
        });
        update_user_1.updateUserController.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockUserService.updateUser());
        });
        delete_user_1.deleteUserController.mockImplementation(async (req, reply) => {
            return reply.send({ message: 'User deleted successfully' });
        });
        get_all_nutritionists_1.getAllNutritionistsController.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockUserService.getAllNutritionists());
        });
        get_all_trainers_1.getAllTrainersController.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockUserService.getAllTrainers());
        });
        assign_nutritionist_1.assignNutritionistController.mockImplementation(async (req, reply) => {
            return reply.status(201).send(services_1.mockUserService.assignNutritionist());
        });
        assign_trainer_1.assignTrainerController.mockImplementation(async (req, reply) => {
            return reply.status(201).send(services_1.mockUserService.assignTrainer());
        });
        get_nutritionist_students_1.getNutritionistStudentsController.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockUserService.getNutritionistStudents());
        });
        get_trainer_students_1.getTrainerStudentsController.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockUserService.getTrainerStudents());
        });
    });
    (0, vitest_1.describe)('GET /', () => {
        (0, vitest_1.it)('should get all users', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(get_all_users_1.getAllUsersController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
    });
    (0, vitest_1.describe)('GET /:id', () => {
        (0, vitest_1.it)('should get a user by ID', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/user-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(get_user_by_id_1.getUserByIdController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('email');
            (0, vitest_1.expect)(responseBody).toHaveProperty('role');
        });
    });
    (0, vitest_1.describe)('PUT /:id', () => {
        (0, vitest_1.it)('should update a user', async () => {
            const response = await server.inject({
                method: 'PUT',
                url: '/user-id',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    name: 'Updated Name',
                    currentWeight: '75',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(update_user_1.updateUserController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
        });
    });
    (0, vitest_1.describe)('DELETE /:id', () => {
        (0, vitest_1.it)('should delete a user', async () => {
            const response = await server.inject({
                method: 'DELETE',
                url: '/user-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(delete_user_1.deleteUserController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('message');
            (0, vitest_1.expect)(responseBody.message).toBe('User deleted successfully');
        });
    });
    (0, vitest_1.describe)('GET /role/nutritionists', () => {
        (0, vitest_1.it)('should get all nutritionists', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/role/nutritionists',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(get_all_nutritionists_1.getAllNutritionistsController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
    });
    (0, vitest_1.describe)('GET /role/trainers', () => {
        (0, vitest_1.it)('should get all trainers', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/role/trainers',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(get_all_trainers_1.getAllTrainersController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
    });
    (0, vitest_1.describe)('POST /assign/nutritionist', () => {
        (0, vitest_1.it)('should assign a nutritionist to a student', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/assign/nutritionist',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    studentId: 'student-id',
                    nutritionistId: 'nutritionist-id',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(assign_nutritionist_1.assignNutritionistController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('nutritionistId');
            (0, vitest_1.expect)(responseBody).toHaveProperty('studentId');
            (0, vitest_1.expect)(responseBody).toHaveProperty('status');
        });
    });
    (0, vitest_1.describe)('POST /assign/trainer', () => {
        (0, vitest_1.it)('should assign a trainer to a student', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/assign/trainer',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    studentId: 'student-id',
                    trainerId: 'trainer-id',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(assign_trainer_1.assignTrainerController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('trainerId');
            (0, vitest_1.expect)(responseBody).toHaveProperty('student2Id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('status');
        });
    });
    (0, vitest_1.describe)('GET /nutritionist/students', () => {
        (0, vitest_1.it)('should get all students for a nutritionist', async () => {
            // Mock JWT verification for nutritionist
            server.jwt.verify = vitest_1.vi
                .fn()
                .mockReturnValue({ id: 'nutritionist-id', role: 'NUTRITIONIST' });
            const response = await server.inject({
                method: 'GET',
                url: '/nutritionist/students',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(get_nutritionist_students_1.getNutritionistStudentsController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
    });
    (0, vitest_1.describe)('GET /trainer/students', () => {
        (0, vitest_1.it)('should get all students for a trainer', async () => {
            // Mock JWT verification for trainer
            server.jwt.verify = vitest_1.vi.fn().mockReturnValue({ id: 'trainer-id', role: 'TRAINER' });
            const response = await server.inject({
                method: 'GET',
                url: '/trainer/students',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(get_trainer_students_1.getTrainerStudentsController).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
    });
});
