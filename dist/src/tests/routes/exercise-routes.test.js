"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const exercise_routes_1 = require("../../routes/exercise-routes");
const exercise_controller_1 = require("../../controllers/exercise-controller");
const services_1 = require("../mocks/services");
vitest_1.vi.mock('../../controllers/exercise-controller', () => {
    return {
        ExerciseController: vitest_1.vi.fn().mockImplementation(() => ({
            createExercise: vitest_1.vi.fn(),
            getExerciseById: vitest_1.vi.fn(),
            updateExercise: vitest_1.vi.fn(),
            deleteExercise: vitest_1.vi.fn(),
            markExerciseAsDone: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('Exercise Routes', () => {
    let server;
    let exerciseController;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        // Mock JWT verification
        server.jwt.verify = vitest_1.vi
            .fn()
            .mockReturnValue({ id: 'user-id', role: 'TRAINER' });
        await server.register(exercise_routes_1.exerciseRoutes);
        // Get the mocked controller instance
        exerciseController = exercise_controller_1.ExerciseController.mock.results[0].value;
        // Set up the mock implementations
        exerciseController.createExercise.mockImplementation(async (req, reply) => {
            return reply.status(201).send(services_1.mockExerciseService.createExercise());
        });
        exerciseController.getExerciseById.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockExerciseService.getExerciseById());
        });
        exerciseController.updateExercise.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockExerciseService.updateExercise());
        });
        exerciseController.deleteExercise.mockImplementation(async (req, reply) => {
            return reply.send({ message: 'Exercise deleted successfully' });
        });
        exerciseController.markExerciseAsDone.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockExerciseService.markExerciseAsDone());
        });
    });
    (0, vitest_1.describe)('POST /', () => {
        (0, vitest_1.it)('should create an exercise', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    name: 'Bench Press',
                    variation: 'Barbell',
                    repetitions: 10,
                    sets: 3,
                    trainingDayId: 'training-day-id',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(exerciseController.createExercise).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('repetitions');
            (0, vitest_1.expect)(responseBody).toHaveProperty('sets');
            (0, vitest_1.expect)(responseBody).toHaveProperty('trainingDayId');
        });
        (0, vitest_1.it)('should validate the request body', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    // Missing name and trainingDayId
                    repetitions: 10,
                    sets: 3,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        });
    });
    (0, vitest_1.describe)('GET /:id', () => {
        (0, vitest_1.it)('should get an exercise by ID', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/exercise-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(exerciseController.getExerciseById).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('repetitions');
            (0, vitest_1.expect)(responseBody).toHaveProperty('sets');
            (0, vitest_1.expect)(responseBody).toHaveProperty('seriesResults');
        });
    });
    (0, vitest_1.describe)('PUT /:id', () => {
        (0, vitest_1.it)('should update an exercise', async () => {
            const response = await server.inject({
                method: 'PUT',
                url: '/exercise-id',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    name: 'Updated Bench Press',
                    repetitions: 12,
                    sets: 4,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(exerciseController.updateExercise).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('repetitions');
            (0, vitest_1.expect)(responseBody).toHaveProperty('sets');
        });
    });
    (0, vitest_1.describe)('DELETE /:id', () => {
        (0, vitest_1.it)('should delete an exercise', async () => {
            const response = await server.inject({
                method: 'DELETE',
                url: '/exercise-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(exerciseController.deleteExercise).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('message');
            (0, vitest_1.expect)(responseBody.message).toBe('Exercise deleted successfully');
        });
    });
    (0, vitest_1.describe)('PATCH /:id/done', () => {
        (0, vitest_1.it)('should mark an exercise as done', async () => {
            // Mock JWT verification for student
            server.jwt.verify = vitest_1.vi
                .fn()
                .mockReturnValue({ id: 'user-id', role: 'STUDENT' });
            const response = await server.inject({
                method: 'PATCH',
                url: '/exercise-id/done',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(exerciseController.markExerciseAsDone).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('done');
            (0, vitest_1.expect)(responseBody.done).toBe(true);
        });
    });
});
