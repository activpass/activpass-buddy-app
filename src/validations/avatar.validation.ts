import { z } from 'zod';

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/common';

export const avatarSchema = z
  .instanceof(File)
  .refine(file => file.size <= MAX_FILE_SIZE, { message: 'File size should be less than 2MB.' })
  .refine(
    file => ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only these types are allowed .jpg, .jpeg, .png and .webp'
  )
  .nullable()
  .optional();
export type AvatarSchema = z.infer<typeof avatarSchema>;
