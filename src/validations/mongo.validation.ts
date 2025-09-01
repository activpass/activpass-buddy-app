import type { z } from 'zod';

import { imageKitFileResponseSchema } from './common.validation';

export const imageKitFileResponseMongoSchema = imageKitFileResponseSchema.partial();
export type ImageKitFileResponseMongoSchema = z.infer<typeof imageKitFileResponseMongoSchema>;
