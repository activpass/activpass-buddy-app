import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
  type PopulateOption,
} from 'mongoose';

import {
  CLIENT_PAYMENT_FREQUENCY,
  CLIENT_PAYMENT_METHOD,
  CLIENT_PAYMENT_STATUS,
} from '@/constants/client/add-form.constant';
import { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';

// Virtuals are not included in the schema type
export interface IIncomeVirtuals {
  id: string;
}

export interface IIncomeSchema extends InferSchemaType<typeof IncomeSchema>, IIncomeVirtuals {
  paymentMethod: keyof typeof CLIENT_PAYMENT_METHOD;
  paymentStatus: keyof typeof CLIENT_PAYMENT_STATUS;
  paymentFrequency: keyof typeof CLIENT_PAYMENT_FREQUENCY;
  tenure: keyof typeof CLIENT_MEMBERSHIP_TENURE;
}

// Here, You have to explicity mention the type of methods.
export interface IIncomeSchemaMethods {}

export interface IIncomeDocument extends HydratedDocument<IIncomeSchema, IIncomeSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface IIncomeModel extends Model<IIncomeSchema, {}, IIncomeSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<IIncomeDocument>;
  getPopulated(
    id: string | mongoose.Schema.Types.ObjectId,
    populatedOption: PopulateOption['populate']
  ): Promise<IIncomeSchema>;
  list<TData = IIncomeDocument>(
    filter?: FilterQuery<IIncomeSchema>,
    populatedOption?: PopulateOption['populate']
  ): Promise<TData[]>;
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
      required: true,
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
    },
    paymentMethod: {
      type: String,
      enum: Object.keys(CLIENT_PAYMENT_METHOD),
      default: CLIENT_PAYMENT_METHOD.CASH.value,
    },
    paymentStatus: {
      type: String,
      enum: Object.keys(CLIENT_PAYMENT_STATUS),
      default: CLIENT_PAYMENT_STATUS.PENDING.value,
    },
    paymentFrequency: {
      type: String,
      enum: Object.keys(CLIENT_PAYMENT_FREQUENCY),
      default: CLIENT_PAYMENT_FREQUENCY.ONE_TIME.value,
    },
    date: { type: Date },
    dueDate: { type: Date },
    tenure: {
      type: String,
      enum: Object.keys(CLIENT_MEMBERSHIP_TENURE),
    },
    amount: { type: Number },
    notes: { type: String },
  },
  schemaOptions
);

IncomeSchema.static('get', async function get(id: string) {
  const income = await this.findById(id).exec();
  if (!income) {
    throw new Error(`No Income found with id '${id}'.`);
  }
  return income;
});

IncomeSchema.static(
  'getPopulated',
  async function getPopulated(
    id: string | mongoose.Schema.Types.ObjectId,
    populatedOption: PopulateOption['populate']
  ): Promise<IIncomeDocument> {
    const income = await this.findById(id).populate(populatedOption).exec();
    if (!income) {
      throw new Error(`No Income found with id '${id}'.`);
    }
    return income;
  }
);

IncomeSchema.static('list', async function list(options, populatedOption) {
  const newOptions = options || {};
  const orgs = await this.find({
    ...newOptions,
  })
    .populate(populatedOption)
    .sort({ createdAt: -1 });
  return orgs;
});

export const IncomeModel =
  (mongoose.models.Income as unknown as IIncomeModel) ||
  mongoose.model<IIncomeSchema, IIncomeModel>('Income', IncomeSchema);
