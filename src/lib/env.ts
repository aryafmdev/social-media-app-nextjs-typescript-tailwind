import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
});

export const env = EnvSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const rawBase = env.NEXT_PUBLIC_API_BASE_URL;
export const publicApiBaseUrl = rawBase
  ? rawBase.replace(/\/+$/, '').replace(/\/api$/, '')
  : rawBase;
