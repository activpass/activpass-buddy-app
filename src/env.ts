import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import { VERCEL_ENV } from './next-helpers/next.constants';

// Don't add NODE_ENV into T3 Env, it changes the tree-shaking behavior
export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    MONGODB_URI: z.string(),
    REDIS_URL: z.string(),
    IMAGEKIT_PRIVATE_KEY: z.string(),

    UPSTASH_REDIS_REST_TOKEN:
      process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
    UPSTASH_REDIS_REST_URL:
      process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
    UPSTASH_REDIS_REST_BASE_KEY_PREFIX:
      process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),

    NEXTAUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      str => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url()
    ),

    ANALYZE: z
      .enum(['true', 'false'])
      .optional()
      .transform(value => value === 'true'),
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),

    ADMIN_USERNAME: z.string().optional(),
    ADMIN_PASSWORD: z.string().optional(),

    SENTRY_AUTH_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string(),
  },
  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtime (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_URL: process.env.REDIS_URL,

    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_BASE_KEY_PREFIX: process.env.UPSTASH_REDIS_REST_BASE_KEY_PREFIX,

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    ANALYZE: process.env.ANALYZE,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,

    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,

    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!VERCEL_ENV || !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
