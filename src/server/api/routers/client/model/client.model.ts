import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
  type PopulateOption,
} from 'mongoose';

import {
  CLIENT_ADDITIONAL_SERVICE,
  CLIENT_CLASS_PREFERENCE,
  CLIENT_FITNESS_GOAL,
  CLIENT_FITNESS_LEVEL,
  CLIENT_GENDER,
  CLIENT_RELATIONSHIP,
} from '@/constants/client/add-form.constant';
import { generateClientCode } from '@/server/api/helpers/common';
import { imageKitFileSchemaDefinition } from '@/server/api/schemas/common';
import { getObjectKeys } from '@/utils/helpers';

// Virtuals are not included in the schema type
export interface IClientVirtuals {
  id: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClientSchema extends InferSchemaType<typeof ClientSchema>, IClientVirtuals {}

// Here, You have to explicity mention the type of methods.
export interface IClientSchemaMethods {}

export interface IClientDocument extends HydratedDocument<IClientSchema, IClientSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface IClientModel extends Model<IClientSchema, {}, IClientSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<IClientDocument>;
  getPopulated(
    id: string | mongoose.Schema.Types.ObjectId,
    populatedOption: PopulateOption['populate']
  ): Promise<IClientDocument>;
  findByEmail(email: string): Promise<IClientDocument>;
  findByPhoneNumber(phoneNumber: number): Promise<IClientDocument>;
  list(filter?: FilterQuery<IClientSchema>): Promise<IClientDocument[]>;
}

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

const ClientSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: true,
    },
    income: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Income',
      required: true,
    },

    clientCode: { type: String, required: true, unique: true, default: () => generateClientCode() },
    avatar: imageKitFileSchemaDefinition,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    gender: {
      type: String,
      required: true,
      enum: getObjectKeys(CLIENT_GENDER),
    },
    dob: { type: Date, required: true, max: new Date() },
    address: { type: String, required: true },

    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true, enum: getObjectKeys(CLIENT_RELATIONSHIP) },
      phoneNumber: { type: Number, required: true },
      email: { type: String },
      address: { type: String },
    },

    healthAndFitness: {
      height: { type: Number, required: true },
      weight: { type: Number, required: true },
      fitnessLevel: { type: String, required: true, enum: getObjectKeys(CLIENT_FITNESS_LEVEL) },
      medicalCondition: { type: String },
      allergy: { type: String },
      injury: { type: String },
    },

    goalsAndPreference: {
      fitnessGoals: [{ type: String, enum: getObjectKeys(CLIENT_FITNESS_GOAL) }],
      classPreference: {
        type: String,
        required: true,
        enum: getObjectKeys(CLIENT_CLASS_PREFERENCE),
      },
      classTimePreference: {
        type: String,
        required: true,
      },
      additionalServices: [{ type: String, enum: getObjectKeys(CLIENT_ADDITIONAL_SERVICE) }],
      instructorSupport: { type: Boolean, default: false },
      fitnessAssessment: { type: Boolean, default: false },
    },

    consentAndAgreement: {
      termsAndConditions: { type: Boolean, default: false },
      privacyPolicy: { type: Boolean, default: false },
      websAppCommunication: { type: Boolean, default: false },
      promotionalCommunication: { type: Boolean, default: false },
      signature: {
        name: {
          type: String,
          required: true,
        },
        provider: {
          type: String,
        },
      },
    },
    isDeleted: { type: Boolean, default: false },

    checkInDate: { type: Date },
    checkOutDate: { type: Date },
  },
  schemaOptions
);

ClientSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

ClientSchema.static('get', async function get(id: string) {
  const client = await this.findById(id).exec();
  if (!client) {
    throw new Error(`No Client found with id '${id}'.`);
  }
  return client;
});

ClientSchema.static('getPopulated', async function get(id, populatedOption) {
  const client = await this.findById(id).populate(populatedOption).exec();
  if (!client) {
    throw new Error(`No Client found with id '${id}'.`);
  }
  return client;
});

ClientSchema.static('findByEmail', async function findByEmail(email: string) {
  const client = await this.findOne({ email }).exec();
  if (!client) {
    throw new Error(`Client with email "${email}" does not exist.`);
  }
  return client;
});

ClientSchema.static('findByPhoneNumber', async function findByPhoneNumber(phoneNumber: string) {
  const client = await this.findOne({ phoneNumber }).exec();
  if (!client) {
    throw new Error(`Client with phone number "${phoneNumber}" does not exist.`);
  }
  return client;
});

ClientSchema.static('list', async function list(options) {
  const newOptions = options || {};
  const clients: IClientDocument[] = await this.find({
    isDeleted: false,
    ...newOptions,
  })
    .populate(['membershipPlan', 'organization'])
    .sort({ createdAt: -1 });
  return clients;
});

export const ClientModel =
  (mongoose.models.Client as unknown as IClientModel) ||
  mongoose.model<IClientSchema, IClientModel>('Client', ClientSchema);
