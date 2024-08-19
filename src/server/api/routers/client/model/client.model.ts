import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import {
  AdditionalService,
  BillingCycle,
  DayPreference,
  FitnessLevel,
  Gender,
  RelationShip,
} from '@/server/api/constants/common.constant';

// Virtuals are not included in the schema type
export interface IClientVirtuals {
  id: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClientSchema
  extends Omit<InferSchemaType<typeof ClientSchema>, 'membership' | 'income'>,
    IClientVirtuals {
  membership?: mongoose.Schema.Types.ObjectId | null;
  income?: mongoose.Schema.Types.ObjectId | null;
}

// Here, You have to explicity mention the type of methods.
export interface IClientSchemaMethods {}

export interface IClientDocument extends HydratedDocument<IClientSchema, IClientSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface IClientModel extends Model<IClientSchema, {}, IClientSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<IClientDocument>;
  findByEmail(email: string): Promise<IClientDocument>;
  findByPhoneNumber(phoneNumber: string): Promise<IClientDocument>;
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
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: true,
    },
    income: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Income',
      required: true,
    },

    uniqueId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    designation: { type: String, required: true },
    address: { type: String, required: true },
    gender: {
      type: String,
      required: true,
      enum: Object.values(Gender),
    },
    avatar: { type: String },
    dob: { type: Date },

    validity: { type: Date },
    cycle: { type: String, enum: Object.values(BillingCycle) },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: {
        type: String,
        enum: Object.values(RelationShip),
      },
      phoneNumber: { type: String },
      email: { type: String },
      address: { type: String },
    },
    role: { type: String },
    healthFitness: {
      height: { type: Number },
      weight: { type: Number },
      medicalConditions: { type: String },
      allergies: { type: String },
      injuries: { type: String },
      currentFitnessLevel: {
        type: String,
        enum: Object.values(FitnessLevel),
      },
    },
    goalsPreferences: {
      fitnessGoals: { type: String },
      dayPreference: {
        type: String,
        enum: Object.values(DayPreference),
      },
      timePreference: { type: Date },
      instructorPreference: { type: Boolean },
      personalAssistance: { type: Boolean },
      additionalService: {
        type: String,
        enum: Object.values(AdditionalService),
      },
      otherService: { type: String },
      fitnessAssessment: { type: Boolean },
    },
    isDeleted: { type: Boolean, default: false },
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
  const clients = await this.find({
    isDeleted: false,
    ...newOptions,
  })
    .populate(['membership', 'organization', 'income'])
    .sort({ createdAt: -1 });
  return clients;
});

export const ClientModel =
  (mongoose.models.Client as IClientModel) ||
  mongoose.model<IClientSchema, IClientModel>('Client', ClientSchema);
