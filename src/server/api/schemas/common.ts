import type { SchemaDefinitionProperty } from 'mongoose';

import type { ImageKitFileResponseMongoSchema } from '@/validations/mongo.validation';

export const imageKitFileSchemaDefinition: Record<
  keyof ImageKitFileResponseMongoSchema,
  SchemaDefinitionProperty
> = {
  fileId: { type: String },
  filePath: { type: String },
  fileType: { type: String },
  height: { type: Number },
  width: { type: Number },
  name: { type: String },
  size: { type: Number },
  thumbnailUrl: { type: String },
  url: { type: String },
};
