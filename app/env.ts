import { z } from 'zod';

export const EnvSchema = z.object({
  VITE_BACKEND_API_URL: z.string(),
  VITE_MAPBOX_ACCESS_TOKEN: z.string().optional(),
  VITE_UPLOADCARE_PUBLIC_KEY: z.string(),
  VITE_UPLOADCARE_SECRET_KEY: z.string(),
});

export const ENV = EnvSchema.parse(import.meta.env);
