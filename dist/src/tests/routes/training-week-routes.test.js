"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const training_week_routes_1 = require("../../routes/training-week-routes");
const training_week_controller_1 = require("../../controllers/training-week-controller");
const services_1 = require("../mocks/services");
vitest_1.vi.mock('../../controllers/training-week-controller', () => {
    return {
        TrainingWeekController: vitest_1.vi.fn().mockImplementation(() => ({
            createTrainingWeek: vitest_1.vi.fn(),
            getAllTrainingWeeks: vitest_1.vi.fn(),
            getTrainingWeekById: vitest_1.vi.fn(),
            updateTrainingWeek: vitest_1.vi.fn(),
            deleteTrainingWeek: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('Training Week Routes', () => {
    let server;
    let trainingWeekController;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        // Mock JWT verification
        server.jwt.verify = vitest_1.vi
            .fn()
            .mockReturnValue({ id: 'user-id', role: 'STUDENT' });
        await server.register(training_week_routes_1.trainingWeekRoutes);
        // Get the mocked controller instance
        trainingWeekController = training_week_controller_1.TrainingWeekController.mock.results[0]
            .value;
        // Set up the mock implementations
        trainingWeekController.createTrainingWeek.mockImplementation(async (req, reply) => {
            return reply
                .status(201)
                .send(services_1.mockTrainingWeekService.createTrainingWeek());
        });
        trainingWeekController.getAllTrainingWeeks.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockTrainingWeekService.getAllTrainingWeeks());
        });
        trainingWeekController.getTrainingWeekById.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockTrainingWeekService.getTrainingWeekById());
        });
        trainingWeekController.updateTrainingWeek.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockTrainingWeekService.updateTrainingWeek());
        });
        trainingWeekController.deleteTrainingWeek.mockImplementation(async (req, reply) => {
            return reply.send({ message: 'Training week deleted successfully' });
        });
    });
    (0, vitest_1.describe)('POST /', () => {
        (0, vitest_1.it)('should create a training week', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    weekNumber: 1,
                    information: 'Test training week',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(trainingWeekController.createTrainingWeek).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weekNumber');
            (0, vitest_1.expect)(responseBody).toHaveProperty('information');
            (0, vitest_1.expect)(responseBody).toHaveProperty('userId');
        });
        (0, vitest_1.it)('should validate the request body', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    // Missing weekNumber
                    information: 'Test training week',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        });
    });
    (0, vitest_1.describe)('GET /', () => {
        (0, vitest_1.it)('should get all training weeks', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(trainingWeekController.getAllTrainingWeeks).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
        (0, vitest_1.it)('should get training weeks for a student', async () => {
            // Mock JWT verification for trainer
            server.jwt.verify = vitest_1.vi
                .fn()
                .mockReturnValue({ id: 'trainer-id', role: 'TRAINER' });
            const response = await server.inject({
                method: 'GET',
                url: '/?studentId=student-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(trainingWeekController.getAllTrainingWeeks).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
    });
    (0, vitest_1.describe)('GET /:id', () => {
        (0, vitest_1.it)('should get a training week by ID', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/training-week-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(trainingWeekController.getTrainingWeekById).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weekNumber');
            (0, vitest_1.expect)(responseBody).toHaveProperty('information');
            (0, vitest_1.expect)(responseBody).toHaveProperty('userId');
            (0, vitest_1.expect)(responseBody).toHaveProperty('trainingDays');
            (0, vitest_1.expect)(responseBody).toHaveProperty('user');
        });
    });
    (0, vitest_1.describe)('PUT /:id', () => {
        (0, vitest_1.it)('should update a training week', async () => {
            const response = await server.inject({
                method: 'PUT',
                url: '/training-week-id',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    weekNumber: 2,
                    information: 'Updated training week',
                    current: true,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(trainingWeekController.updateTrainingWeek).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weekNumber');
            (0, vitest_1.expect)(responseBody).toHaveProperty('information');
        });
    });
    (0, vitest_1.describe)('DELETE /:id', () => {
        (0, vitest_1.it)('should delete a training week', async () => {
            // Mock JWT verification for trainer
            server.jwt.verify = vitest_1.vi
                .fn()
                .mockReturnValue({ id: 'trainer-id', role: 'TRAINER' });
            const response = await server.inject({
                method: 'DELETE',
                url: '/training-week-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(trainingWeekController.deleteTrainingWeek).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('message');
            (0, vitest_1.expect)(responseBody.message).toBe('Training week deleted successfully');
        });
    });
});
