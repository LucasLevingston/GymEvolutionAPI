"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const serie_routes_1 = require("../../routes/serie-routes");
const serie_controller_1 = require("../../controllers/serie-controller");
const services_1 = require("../mocks/services");
vitest_1.vi.mock('../../controllers/serie-controller', () => {
    return {
        SerieController: vitest_1.vi.fn().mockImplementation(() => ({
            createSerie: vitest_1.vi.fn(),
            getSerieById: vitest_1.vi.fn(),
            updateSerie: vitest_1.vi.fn(),
            deleteSerie: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('Serie Routes', () => {
    let server;
    let serieController;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        // Mock JWT verification
        server.jwt.verify = vitest_1.vi
            .fn()
            .mockReturnValue({ id: 'user-id', role: 'STUDENT' });
        await server.register(serie_routes_1.serieRoutes);
        // Get the mocked controller instance
        serieController = serie_controller_1.SerieController.mock.results[0].value;
        // Set up the mock implementations
        serieController.createSerie.mockImplementation(async (req, reply) => {
            return reply.status(201).send(services_1.mockSerieService.createSerie());
        });
        serieController.getSerieById.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockSerieService.getSerieById());
        });
        serieController.updateSerie.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockSerieService.updateSerie());
        });
        serieController.deleteSerie.mockImplementation(async (req, reply) => {
            return reply.send({ message: 'Serie deleted successfully' });
        });
    });
    (0, vitest_1.describe)('POST /', () => {
        (0, vitest_1.it)('should create a serie', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    seriesIndex: 0,
                    repetitions: 10,
                    weight: 100,
                    exerciseId: 'exercise-id',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(serieController.createSerie).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('seriesIndex');
            (0, vitest_1.expect)(responseBody).toHaveProperty('repetitions');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weight');
            (0, vitest_1.expect)(responseBody).toHaveProperty('exerciseId');
        });
        (0, vitest_1.it)('should validate the request body', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                // Missing seriesIndex, repetitions, weight, and exerciseId
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        });
    });
    (0, vitest_1.describe)('GET /:id', () => {
        (0, vitest_1.it)('should get a serie by ID', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/serie-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(serieController.getSerieById).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('seriesIndex');
            (0, vitest_1.expect)(responseBody).toHaveProperty('repetitions');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weight');
            (0, vitest_1.expect)(responseBody).toHaveProperty('exerciseId');
        });
    });
    (0, vitest_1.describe)('PUT /:id', () => {
        (0, vitest_1.it)('should update a serie', async () => {
            const response = await server.inject({
                method: 'PUT',
                url: '/serie-id',
                headers: {
                    authorization: 'Bearer token',
                },
                payload: {
                    repetitions: 12,
                    weight: 110,
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(serieController.updateSerie).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('seriesIndex');
            (0, vitest_1.expect)(responseBody).toHaveProperty('repetitions');
            (0, vitest_1.expect)(responseBody).toHaveProperty('weight');
        });
    });
    (0, vitest_1.describe)('DELETE /:id', () => {
        (0, vitest_1.it)('should delete a serie', async () => {
            // Mock JWT verification for trainer
            server.jwt.verify = vitest_1.vi
                .fn()
                .mockReturnValue({ id: 'trainer-id', role: 'TRAINER' });
            const response = await server.inject({
                method: 'DELETE',
                url: '/serie-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(serieController.deleteSerie).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('message');
            (0, vitest_1.expect)(responseBody.message).toBe('Serie deleted successfully');
        });
    });
});
