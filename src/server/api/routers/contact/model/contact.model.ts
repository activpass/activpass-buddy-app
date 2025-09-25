import mongoose, { type FilterQuery, type HydratedDocument, type Model, Schema } from 'mongoose';

import {
  contactBaseSchema,
  type IContactBase,
  type IContactSchema,
} from '@/validations/contact.validation';

// Mongoose document type
export type IContactDocument = HydratedDocument<IContactSchema>;

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

// Create native Mongoose schema
const ContactMongooseSchema = new Schema<IContactBase>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address',
      },
    },
    type: {
      type: String,
      required: true,
      enum: ['general', 'support', 'billing', 'feature', 'bug', 'partnership'],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, 'Subject must be at least 5 characters'],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
    versionKey: false, // hide __v property
    timestamps: true,
  }
);

// Indexes
ContactMongooseSchema.index({ email: 1 });
ContactMongooseSchema.index({ type: 1 });
ContactMongooseSchema.index({ status: 1 });
ContactMongooseSchema.index({ createdAt: -1 });
ContactMongooseSchema.index({ name: 'text', subject: 'text', message: 'text' });

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
