"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const weight_routes_1 = require("../../routes/weight-routes");
const weight_controller_1 = require("../../controllers/weight-controller");
const services_1 = require("../mocks/services");
vitest_1.vi.mock('../../controllers/weight-controller', () => {
    return {
        WeightController: vitest_1.vi.fn().mockImplementation(() => ({
            addWeightRecord: vitest_1.vi.fn(),
            getWeightHistory: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('Weight Routes', () => {
    let server;
    let weightController;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        // Mock JWT verification
        server.jwt.verify = vitest_1.vi
            .fn()
            .mockReturnValue({ id: 'user-id', role: 'STUDENT' });
        await server.register(weight_routes_1.weightRoutes);
        // Get the mocked controller instance
        weightController = weight_controller_1.WeightController.mock.results[0].value;
        // Set up the mock implementations
        weightController.addWeightRecord.mockImplementation(async (req, reply) => {
            return reply.status(201).send(services_1.mockWeightService.addWeightRecord());
        });
        weightController.getWeightHistory.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockWeightService.getWeightHistory());
        });
    });
    (0, vitest_1.describe)('POST /', () => {
        (0, vitest_1.it)('should add a weight record', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    weight: '80',
                    bf: '15',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(weightController.addWeightRecord).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weight');
            (0, vitest_1.expect)(responseBody).toHaveProperty('bf');
            (0, vitest_1.expect)(responseBody).toHaveProperty('date');
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
                    // Missing weight
                    bf: '15',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        });
    });
    (0, vitest_1.describe)('GET /', () => {
        (0, vitest_1.it)('should get weight history', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(weightController.getWeightHistory).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
        (0, vitest_1.it)('should get weight history for a student', async () => {
            // Mock JWT verification for nutritionist
            server.jwt.verify = vitest_1.vi
                .fn()
                .mockReturnValue({ id: 'nutritionist-id', role: 'NUTRITIONIST' });
            const response = await server.inject({
                method: 'GET',
                url: '/?studentId=student-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(weightController.getWeightHistory).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
    });
});
