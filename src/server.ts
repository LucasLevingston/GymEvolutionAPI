import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { userRoutes } from './routes/user-routes'
import { authRoutes } from './routes/auth-routes'
import { historyRoutes } from './routes/history-routes'
import { trainingWeekRoutes } from './routes/training-week-routes'
import { weightRoutes } from './routes/weight-routes'
import { trainingDayRoutes } from './routes/training-day-routes'
import { exerciseRoutes } from './routes/exercise-routes'
import { serieRoutes } from './routes/serie-routes'
import { dietRoutes } from './routes/diet-routes'
import { mealRoutes } from './routes/meal-routes'
import { mealItemsRoutes } from './routes/meal-items-routes'
import { errorHandler } from './utils/error-handler'
import { env } from './env'
import { professionalRoutes } from 'routes/professional-routes'
import { planRoutes } from 'routes/plan-routes'
import { notificationRoutes } from 'routes/notification-routes'
import { purchaseRoutes } from 'routes/purchase-routes'
import { meetingRoutes } from 'routes/meeting-routes'
import { googleRoutes } from 'routes/google-routes'
import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { fatsecretRoutes } from 'routes/fatsecret-routes'

const { PORT: port, HOST: host, JWT_SECRET_KEY } = env

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: JWT_SECRET_KEY || 'secret-key',
})

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Gym Evolution API',
      description: 'API for Gym Evolution',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
})

app.setErrorHandler(errorHandler)
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(fastifyCookie)
app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'uploads'),
  prefix: '/uploads/',
})

app.register(userRoutes, { prefix: '/users' })
app.register(authRoutes, { prefix: '/auth' })
app.register(historyRoutes, { prefix: '/history' })
app.register(trainingWeekRoutes, { prefix: '/training-weeks' })
app.register(weightRoutes, { prefix: '/weights' })
app.register(trainingDayRoutes, { prefix: '/training-days' })
app.register(exerciseRoutes, { prefix: '/exercises' })
app.register(serieRoutes, { prefix: '/series' })
app.register(dietRoutes, { prefix: '/diets' })
app.register(mealRoutes, { prefix: '/meals' })
app.register(mealItemsRoutes, { prefix: '/meal-items' })
app.register(professionalRoutes, { prefix: '/professionals' })
app.register(planRoutes, { prefix: '/plans' })
app.register(notificationRoutes, { prefix: '/notifications' })
app.register(purchaseRoutes, { prefix: '/purchases' })
app.register(meetingRoutes, { prefix: '/meetings' })
app.register(googleRoutes, { prefix: '/google' })
app.register(fatsecretRoutes, { prefix: '/fatsecret' })

app.get('/help', () => {
  return {
    message: 'Welcome to GymEvolution!',
  }
})

app.listen({ host, port }, async (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server is running on http://${host}:${port}`)
})
