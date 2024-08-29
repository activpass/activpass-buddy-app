import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import { BillingCycle, PaymentMode, PaymentStatus } from '@/server/api/constants/common.constant';

// Virtuals are not included in the schema type
export interface IIncomeVirtuals {
  id: string;
}

export interface IIncomeSchema extends InferSchemaType<typeof IncomeSchema>, IIncomeVirtuals {
  _id: mongoose.Schema.Types.ObjectId;
}

// Here, You have to explicity mention the type of methods.
export interface IIncomeSchemaMethods {}

export interface IIncomeDocument extends HydratedDocument<IIncomeSchema, IIncomeSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface IIncomeModel extends Model<IIncomeSchema, {}, IIncomeSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<IIncomeDocument>;
  list(filter?: FilterQuery<IIncomeSchema>): Promise<IIncomeDocument[]>;
}

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

const IncomeSchema = new mongoose.Schema(
  {
    invoiceId: { type: String },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    mode: {
      type: String,
      enum: [...Object.values(PaymentMode)],
      default: PaymentMode.cash,
    },
    status: {
      type: String,
      enum: [...Object.keys(PaymentStatus)],
      default: PaymentStatus.pending,
    },
    date: { type: Date },
    dueDate: { type: Date },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
    },
    cycle: {
      type: String,
      enum: [...Object.values(BillingCycle)],
    },
    amount: { type: Number },
    notes: { type: String },
  },
  schemaOptions
);

IncomeSchema.static('get', async function get(id: string) {
  const org = await this.findById(id).exec();
  if (!org) {
    throw new Error(`No Income found with id '${id}'.`);
  }
  return org;
});

IncomeSchema.static('list', async function list(options) {
  const newOptions = options || {};
  const orgs = await this.find({
    ...newOptions,
  }).sort({ createdAt: -1 });
  return orgs;
});

export const IncomeModel =
  (mongoose.models.Income as unknown as IIncomeModel) ||
  mongoose.model<IIncomeSchema, IIncomeModel>('Income', IncomeSchema);
