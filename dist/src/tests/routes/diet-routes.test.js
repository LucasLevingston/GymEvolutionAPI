"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const diet_routes_1 = require("../../routes/diet-routes");
const diet_controller_1 = require("../../controllers/diet-controller");
const services_1 = require("../mocks/services");
vitest_1.vi.mock('../../controllers/diet-controller', () => {
    return {
        DietController: vitest_1.vi.fn().mockImplementation(() => ({
            createDiet: vitest_1.vi.fn(),
            getAllDiets: vitest_1.vi.fn(),
            getDietById: vitest_1.vi.fn(),
            updateDiet: vitest_1.vi.fn(),
            deleteDiet: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('Diet Routes', () => {
    let server;
    let dietController;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        // Mock JWT verification
        server.jwt.verify = vitest_1.vi
            .fn()
            .mockReturnValue({ id: 'user-id', role: 'NUTRITIONIST' });
        await server.register(diet_routes_1.dietRoutes);
        // Get the mocked controller instance
        dietController = diet_controller_1.DietController.mock.results[0].value;
        // Set up the mock implementations
        dietController.createDiet.mockImplementation(async (req, reply) => {
            return reply.status(201).send(services_1.mockDietService.createDiet());
        });
        dietController.getAllDiets.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockDietService.getAllDiets());
        });
        dietController.getDietById.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockDietService.getDietById());
        });
        dietController.updateDiet.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockDietService.updateDiet());
        });
        dietController.deleteDiet.mockImplementation(async (req, reply) => {
            return reply.send({ message: 'Diet deleted successfully' });
        });
    });
    (0, vitest_1.describe)('POST /', () => {
        (0, vitest_1.it)('should create a diet', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    weekNumber: 1,
                    totalCalories: 2000,
                    totalProtein: 150,
                    totalCarbohydrates: 200,
                    totalFat: 70,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(dietController.createDiet).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weekNumber');
            (0, vitest_1.expect)(responseBody).toHaveProperty('totalCalories');
            (0, vitest_1.expect)(responseBody).toHaveProperty('totalProtein');
            (0, vitest_1.expect)(responseBody).toHaveProperty('totalCarbohydrates');
            (0, vitest_1.expect)(responseBody).toHaveProperty('totalFat');
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
                    totalCalories: 2000,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        });
    });
    (0, vitest_1.describe)('GET /', () => {
        (0, vitest_1.it)('should get all diets', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(dietController.getAllDiets).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
        (0, vitest_1.it)('should get diets for a student', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/?studentId=student-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(dietController.getAllDiets).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
    });
    (0, vitest_1.describe)('GET /:id', () => {
        (0, vitest_1.it)('should get a diet by ID', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/diet-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(dietController.getDietById).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weekNumber');
            (0, vitest_1.expect)(responseBody).toHaveProperty('totalCalories');
            (0, vitest_1.expect)(responseBody).toHaveProperty('meals');
            (0, vitest_1.expect)(responseBody).toHaveProperty('User');
        });
    });
    (0, vitest_1.describe)('PUT /:id', () => {
        (0, vitest_1.it)('should update a diet', async () => {
            const response = await server.inject({
                method: 'PUT',
                url: '/diet-id',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    weekNumber: 2,
                    totalCalories: 2200,
                    totalProtein: 160,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(dietController.updateDiet).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weekNumber');
            (0, vitest_1.expect)(responseBody).toHaveProperty('totalCalories');
        });
    });
    (0, vitest_1.describe)('DELETE /:id', () => {
        (0, vitest_1.it)('should delete a diet', async () => {
            const response = await server.inject({
                method: 'DELETE',
                url: '/diet-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(dietController.deleteDiet).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('message');
            (0, vitest_1.expect)(responseBody.message).toBe('Diet deleted successfully');
        });
    });
});
