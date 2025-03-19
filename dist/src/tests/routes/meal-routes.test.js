"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const meal_routes_1 = require("../../routes/meal-routes");
const meal_controller_1 = require("../../controllers/meal-controller");
const services_1 = require("../mocks/services");
vitest_1.vi.mock('../../controllers/meal-controller', () => {
    return {
        MealController: vitest_1.vi.fn().mockImplementation(() => ({
            createMeal: vitest_1.vi.fn(),
            getMealById: vitest_1.vi.fn(),
            updateMeal: vitest_1.vi.fn(),
            deleteMeal: vitest_1.vi.fn(),
            markMealAsCompleted: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('Meal Routes', () => {
    let server;
    let mealController;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        // Mock JWT verification
        server.jwt.verify = vitest_1.vi
            .fn()
            .mockReturnValue({ id: 'user-id', role: 'NUTRITIONIST' });
        await server.register(meal_routes_1.mealRoutes);
        // Get the mocked controller instance
        mealController = meal_controller_1.MealController.mock.results[0].value;
        // Set up the mock implementations
        mealController.createMeal.mockImplementation(async (req, reply) => {
            return reply.status(201).send(services_1.mockMealService.createMeal());
        });
        mealController.getMealById.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockMealService.getMealById());
        });
        mealController.updateMeal.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockMealService.updateMeal());
        });
        mealController.deleteMeal.mockImplementation(async (req, reply) => {
            return reply.send({ message: 'Meal deleted successfully' });
        });
        mealController.markMealAsCompleted.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockMealService.markMealAsCompleted());
        });
    });
    (0, vitest_1.describe)('POST /', () => {
        (0, vitest_1.it)('should create a meal', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    name: 'Breakfast',
                    calories: 500,
                    protein: 30,
                    carbohydrates: 50,
                    fat: 20,
                    dietId: 'diet-id',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(mealController.createMeal).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('calories');
            (0, vitest_1.expect)(responseBody).toHaveProperty('protein');
            (0, vitest_1.expect)(responseBody).toHaveProperty('carbohydrates');
            (0, vitest_1.expect)(responseBody).toHaveProperty('fat');
            (0, vitest_1.expect)(responseBody).toHaveProperty('dietId');
        });
        (0, vitest_1.it)('should validate the request body', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    // Missing name and dietId
                    calories: 500,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        });
    });
    (0, vitest_1.describe)('GET /:id', () => {
        (0, vitest_1.it)('should get a meal by ID', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/meal-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(mealController.getMealById).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('calories');
            (0, vitest_1.expect)(responseBody).toHaveProperty('mealItems');
        });
    });
    (0, vitest_1.describe)('PUT /:id', () => {
        (0, vitest_1.it)('should update a meal', async () => {
            const response = await server.inject({
                method: 'PUT',
                url: '/meal-id',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    name: 'Updated Breakfast',
                    calories: 550,
                    protein: 35,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(mealController.updateMeal).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('calories');
        });
    });
    (0, vitest_1.describe)('DELETE /:id', () => {
        (0, vitest_1.it)('should delete a meal', async () => {
            const response = await server.inject({
                method: 'DELETE',
                url: '/meal-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(mealController.deleteMeal).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('message');
            (0, vitest_1.expect)(responseBody.message).toBe('Meal deleted successfully');
        });
    });
    (0, vitest_1.describe)('PATCH /:id/complete', () => {
        (0, vitest_1.it)('should mark a meal as completed', async () => {
            // Mock JWT verification for student
            server.jwt.verify = vitest_1.vi
                .fn()
                .mockReturnValue({ id: 'user-id', role: 'STUDENT' });
            const response = await server.inject({
                method: 'PATCH',
                url: '/meal-id/complete',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(mealController.markMealAsCompleted).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('isCompleted');
            (0, vitest_1.expect)(responseBody.isCompleted).toBe(true);
        });
    });
});
