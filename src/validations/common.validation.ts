import { z } from 'zod';

export const phoneNumberSchema = z
  .number({
    message: 'Phone number is required',
  })
  .int({
    message: 'Phone number must be a number without decimal',
  })
  .refine(value => value.toString().length === 10, {
    message: 'Phone number must be a 10 digit number',
  });

export const imageKitImageSchema = z.object({
  fileId: z.string(),
  filePath: z.string(),
  fileType: z.string(),
  height: z.number(),
  width: z.number(),
  name: z.string(),
  size: z.number(),
  thumbnailUrl: z.string(),
  url: z.string(),
});
export type ImageKitImageSchema = z.infer<typeof imageKitImageSchema>;
