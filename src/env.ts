import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  NODEMAILER_PASS: z.string(),
  FRONTEND_URL: z.string(),
  BACKEND_URL: z.string(),
  HOST: z.string(),
  MERCADOPAGO_SECRET_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export const env = {
  ...envSchema.parse(process.env),
};
