import zMongooseSchema from '@zodyac/zod-mongoose';
import mongoose, { type FilterQuery, type HydratedDocument, type Model } from 'mongoose';
import { z } from 'zod';

// Define Zod schemas for validation and type inference
const ContactTypeEnum = z.enum(['general', 'support', 'billing', 'feature', 'bug', 'partnership']);
const ContactStatusEnum = z.enum(['pending', 'in-progress', 'resolved']);

// Base contact schema (for creation) - this will be used to generate the Mongoose schema
export const contactBaseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  type: ContactTypeEnum,
  subject: z.string().min(5, 'Subject must be at least 5 characters').trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').trim(),
  status: ContactStatusEnum.default('pending'),
  adminNotes: z.string().trim().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// Full contact schema (including timestamps and id)
export const contactSchema = contactBaseSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type inference from Zod schemas
export type IContactBase = z.infer<typeof contactBaseSchema>;
export type IContactSchema = z.infer<typeof contactSchema>;
export type ContactType = z.infer<typeof ContactTypeEnum>;
export type ContactStatus = z.infer<typeof ContactStatusEnum>;

// Mongoose document type
export type IContactDocument = HydratedDocument<IContactBase & IContactSchema>;

// Here, You have to explicitly mention the type of methods.
export interface IContactSchemaMethods {}

// Here, You have to explicitly mention the type of statics.
export interface IContactModel extends Model<IContactBase, {}, IContactSchemaMethods> {
  /**
   * Find contacts with pagination
   */
  findWithPagination(
    filter: FilterQuery<IContactBase>,
    page: number,
    limit: number
  ): Promise<{
    contacts: IContactDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>;
}

// Create the Mongoose schema using @zodyac/zod-mongoose
const ContactMongooseSchema = zMongooseSchema(contactBaseSchema, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(_doc, ret) {
      const retModified = { ...ret };
      retModified.id = retModified._id.toString();
      delete retModified._id;
      delete retModified.__v;
      return retModified;
    },
  },
  toObject: {
    virtuals: true,
    transform(_doc, ret) {
      const retModified = { ...ret };
      retModified.id = retModified._id.toString();
      delete retModified._id;
      delete retModified.__v;
      return retModified;
    },
  },
});

// Indexes
ContactMongooseSchema.index({ email: 1 });
ContactMongooseSchema.index({ type: 1 });
ContactMongooseSchema.index({ status: 1 });
ContactMongooseSchema.index({ createdAt: -1 });
ContactMongooseSchema.index({ name: 'text', subject: 'text', message: 'text' });

// Methods
ContactMongooseSchema.methods.toClientObject = function toClientObject(): IContactSchema {
  return this.toObject();
};

// Statics
ContactMongooseSchema.statics.findWithPagination = async function findWithPagination(
  filter: FilterQuery<IContactBase>,
  page: number,
  limit: number
) {
  const skip = (page - 1) * limit;

  const [contacts, total] = await Promise.all([
    this.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    this.countDocuments(filter),
  ]);

  return {
    contacts,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const ContactModel: IContactModel =
  (mongoose.models.Contact as unknown as IContactModel) ||
  mongoose.model('Contact', ContactMongooseSchema);

// Validation functions using Zod
export const validateContactInput = (data: unknown) => {
  return contactBaseSchema.safeParse(data);
};

export const validateContactUpdate = (data: unknown) => {
  return contactBaseSchema.partial().safeParse(data);
};
