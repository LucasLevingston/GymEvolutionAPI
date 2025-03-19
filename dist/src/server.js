"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const user_routes_1 = require("./routes/user-routes");
const auth_routes_1 = require("./routes/auth-routes");
const history_routes_1 = require("./routes/history-routes");
const training_week_routes_1 = require("./routes/training-week-routes");
const weight_routes_1 = require("./routes/weight-routes");
const training_day_routes_1 = require("./routes/training-day-routes");
const exercise_routes_1 = require("./routes/exercise-routes");
const serie_routes_1 = require("./routes/serie-routes");
const diet_routes_1 = require("./routes/diet-routes");
const meal_routes_1 = require("./routes/meal-routes");
const meal_items_routes_1 = require("./routes/meal-items-routes");
const error_handler_1 = require("./utils/error-handler");
const env_1 = require("./env");
const app = (0, fastify_1.default)().withTypeProvider();
app.register(cors_1.default, {
    origin: '*',
});
app.register(jwt_1.default, {
    secret: env_1.env.JWT_SECRET_KEY || 'secret-key',
});
app.register(swagger_1.default, {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'Gym Evolution API',
            description: 'API for Gym Evolution',
            version: '1.0.0',
        },
    },
    transform: fastify_type_provider_zod_1.jsonSchemaTransform,
});
app.register(swagger_ui_1.default, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
    },
});
app.setErrorHandler(error_handler_1.errorHandler);
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.register(user_routes_1.userRoutes, { prefix: '/users' });
app.register(auth_routes_1.authRoutes, { prefix: '/auth' });
app.register(history_routes_1.historyRoutes, { prefix: '/history' });
app.register(training_week_routes_1.trainingWeekRoutes, { prefix: '/training-weeks' });
app.register(weight_routes_1.weightRoutes, { prefix: '/weights' });
app.register(training_day_routes_1.trainingDayRoutes, { prefix: '/training-days' });
app.register(exercise_routes_1.exerciseRoutes, { prefix: '/exercises' });
app.register(serie_routes_1.serieRoutes, { prefix: '/series' });
app.register(diet_routes_1.dietRoutes, { prefix: '/diets' });
app.register(meal_routes_1.mealRoutes, { prefix: '/meals' });
app.register(meal_items_routes_1.mealItemsRoutes, { prefix: '/meal-items' });
app.get('/help', () => {
    return {
        message: 'Welcome to GymEvolution!',
    };
});
const port = env_1.env.PORT;
const host = env_1.env.HOST;
app.listen({ host, port }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running on http://${host}:${port}`);
});
