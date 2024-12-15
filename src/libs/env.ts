import { z } from 'zod';

export const EnvSchema = z.object({
  VITE_BACKEND_API_URL: z.string(),
  VITE_JWT_SECRET_KEY: z.string(),
});

export const ENV = EnvSchema.parse(import.meta.env);

export const BACKEND_API_URL = ENV.VITE_BACKEND_API_URL;
export const JWT_SECRET_KEY = ENV.VITE_JWT_SECRET_KEY;
