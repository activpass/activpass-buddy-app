import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import { PaymentMethod, Software } from '@/server/api/constants/common.constant';

const HolidayConfig = {
  name: { type: String, required: true },
  date: { type: Date, required: true },
};

const EmployeePayrollConfig = {
  label: { type: String, required: true },
  value: { type: Number },
  custom: { type: Boolean, default: true },
};

export interface IOrganizationSchema extends InferSchemaType<typeof OrganizationSchema> {
  _id: mongoose.Schema.Types.ObjectId;

  // Virtuals are not included in the schema type
  id: string;
}

// Here, You have to explicity mention the type of methods.
export interface IOrganizationSchemaMethods {}

export interface IOrganizationDocument
  extends HydratedDocument<IOrganizationSchema, IOrganizationSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface IOrganizationModel
  extends Model<IOrganizationSchema, {}, IOrganizationSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<IOrganizationDocument>;
  list(filter?: FilterQuery<IOrganizationSchema>): Promise<IOrganizationDocument[]>;
}

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    email: { type: String },
    website: { type: String },
    coordinates: {
      lat: { type: String },
      lng: { type: String },
    },
    address: { type: String },
    billingInfo: {
      paymentMethod: {
        type: String,
        enum: [
          PaymentMethod.creditCard,
          PaymentMethod.debitCard,
          PaymentMethod.cash,
          PaymentMethod.upi,
          PaymentMethod.bankTransfer,
        ],
      },
    },
    softwareIntegration: {
      existingSoftware: {
        type: String,
        enum: [
          Software.gymMgmtSoftware,
          Software.accountingSoftware,
          Software.crmSoftware,
          Software.noSoftware,
          Software.other,
        ],
      },
      challenges: { type: String },
      preferences: { type: String },
    },
    employeePayrollOptions: {
      earnings: [EmployeePayrollConfig],
      deductions: [EmployeePayrollConfig],
    },
    declaredHolidays: {
      type: [HolidayConfig],
    },
    isDeleted: { type: Boolean, default: false },
  },
  schemaOptions
);

OrganizationSchema.static('get', async function get(id: string) {
  const org = await this.findById(id).exec();
  if (!org) {
    throw new Error(`No Organization found with id '${id}'.`);
  }
  return org;
});

OrganizationSchema.static('list', async function list(options) {
  const newOptions = options || {};
  const orgs = await this.find({
    isDeleted: false,
    ...newOptions,
  }).sort({ createdAt: -1 });
  return orgs;
});

export const OrganizationModel =
  (mongoose.models.Organization as unknown as IOrganizationModel) ||
  mongoose.model<IOrganizationSchema, IOrganizationModel>('Organization', OrganizationSchema);
