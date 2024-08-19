import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import { MembershipType } from '@/server/api/constants/common.constant';

// Virtuals are not included in the schema type
export interface IMembershipPlanVirtuals {
  id: string;
  discountedAmount: number;
}

export interface IMembershipPlanSchema
  extends InferSchemaType<typeof MembershipPlanSchema>,
    IMembershipPlanVirtuals {}

// Here, You have to explicity mention the type of methods.
export interface IMembershipPlanSchemaMethods {}

export interface IMembershipPlanDocument
  extends HydratedDocument<IMembershipPlanSchema, IMembershipPlanSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface IMembershipPlanModel
  extends Model<IMembershipPlanSchema, {}, IMembershipPlanSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<IMembershipPlanDocument>;
  list(filter?: FilterQuery<IMembershipPlanSchema>): Promise<IMembershipPlanDocument[]>;
}

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

const MembershipPlanSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    planName: { type: String, required: true },
    tenure: {
      type: String,
      enum: Object.values(MembershipType),
      required: true,
    },
    amount: { type: Number, required: true },
    features: { type: String, required: true },
    discountPercentage: { type: Number, default: 0 },
  },
  schemaOptions
);

MembershipPlanSchema.virtual('discountedAmount').get(function discountedAmount() {
  return this.amount - (this.amount * this.discountPercentage) / 100;
});

MembershipPlanSchema.static('get', async function get(id: string) {
  const client = await this.findById(id).exec();
  if (!client) {
    throw new Error(`No MembershipPlan found with id '${id}'.`);
  }
  return client;
});

MembershipPlanSchema.static('list', async function list(options) {
  const newOptions = options || {};
  const docs = await this.find({
    ...newOptions,
  })
    .populate(['organization'])
    .sort({ createdAt: -1 });
  return docs;
});

export const MembershipPlanModel =
  (mongoose.models.MembershipPlan as unknown as IMembershipPlanModel) ||
  mongoose.model<IMembershipPlanSchema, IMembershipPlanModel>(
    'MembershipPlan',
    MembershipPlanSchema
  );
