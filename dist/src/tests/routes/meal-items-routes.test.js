"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const meal_items_routes_1 = require("../../routes/meal-items-routes");
const meal_items_controller_1 = require("../../controllers/meal-items-controller");
const services_1 = require("../mocks/services");
vitest_1.vi.mock('../../controllers/meal-items-controller', () => {
    return {
        MealItemsController: vitest_1.vi.fn().mockImplementation(() => ({
            createMealItem: vitest_1.vi.fn(),
            getMealItemById: vitest_1.vi.fn(),
            updateMealItem: vitest_1.vi.fn(),
            deleteMealItem: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('Meal Items Routes', () => {
    let server;
    let mealItemsController;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        // Mock JWT verification
        server.jwt.verify = vitest_1.vi
            .fn()
            .mockReturnValue({ id: 'user-id', role: 'NUTRITIONIST' });
        await server.register(meal_items_routes_1.mealItemsRoutes);
        // Get the mocked controller instance
        mealItemsController = meal_items_controller_1.MealItemsController.mock.results[0].value;
        // Set up the mock implementations
        mealItemsController.createMealItem.mockImplementation(async (req, reply) => {
            return reply.status(201).send(services_1.mockMealItemsService.createMealItem());
        });
        mealItemsController.getMealItemById.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockMealItemsService.getMealItemById());
        });
        mealItemsController.updateMealItem.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockMealItemsService.updateMealItem());
        });
        mealItemsController.deleteMealItem.mockImplementation(async (req, reply) => {
            return reply.send({ message: 'Meal item deleted successfully' });
        });
    });
    (0, vitest_1.describe)('POST /', () => {
        (0, vitest_1.it)('should create a meal item', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    name: 'Eggs',
                    quantity: 2,
                    calories: 150,
                    protein: 12,
                    carbohydrates: 1,
                    fat: 10,
                    mealId: 'meal-id',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(mealItemsController.createMealItem).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('quantity');
            (0, vitest_1.expect)(responseBody).toHaveProperty('calories');
            (0, vitest_1.expect)(responseBody).toHaveProperty('protein');
            (0, vitest_1.expect)(responseBody).toHaveProperty('carbohydrates');
            (0, vitest_1.expect)(responseBody).toHaveProperty('fat');
            (0, vitest_1.expect)(responseBody).toHaveProperty('mealId');
        });
        (0, vitest_1.it)('should validate the request body', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    // Missing name, quantity, and mealId
                    calories: 150,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        });
    });
    (0, vitest_1.describe)('GET /:id', () => {
        (0, vitest_1.it)('should get a meal item by ID', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/meal-item-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(mealItemsController.getMealItemById).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('quantity');
            (0, vitest_1.expect)(responseBody).toHaveProperty('calories');
        });
    });
    (0, vitest_1.describe)('PUT /:id', () => {
        (0, vitest_1.it)('should update a meal item', async () => {
            const response = await server.inject({
                method: 'PUT',
                url: '/meal-item-id',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    name: 'Updated Eggs',
                    quantity: 3,
                    calories: 225,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(mealItemsController.updateMealItem).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('quantity');
            (0, vitest_1.expect)(responseBody).toHaveProperty('calories');
        });
    });
    (0, vitest_1.describe)('DELETE /:id', () => {
        (0, vitest_1.it)('should delete a meal item', async () => {
            const response = await server.inject({
                method: 'DELETE',
                url: '/meal-item-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(mealItemsController.deleteMealItem).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('message');
            (0, vitest_1.expect)(responseBody.message).toBe('Meal item deleted successfully');
        });
    });
});
