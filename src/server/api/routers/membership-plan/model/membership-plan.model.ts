import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
  type ProjectionType,
} from 'mongoose';

import { createMembershipPlanInputSchema } from '../membership-plan.input';

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
  list(
    filter?: FilterQuery<IMembershipPlanSchema>,
    projection?: ProjectionType<IMembershipPlanSchema>
  ): Promise<IMembershipPlanDocument[]>;
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
      enum: Object.values(createMembershipPlanInputSchema.shape.tenure.enum),
      required: true,
    },
    amount: { type: Number, required: true },
    features: [
      {
        value: { type: String, required: true },
      },
    ],
    discountPercentage: { type: Number },
  },
  schemaOptions
);

MembershipPlanSchema.virtual('discountedAmount').get(function discountedAmount() {
  if (!this.amount) return 0;
  return this.amount - (this.amount * (this.discountPercentage || 0)) / 100;
});

MembershipPlanSchema.static('get', async function get(id: string) {
  const client = await this.findById(id).exec();
  if (!client) {
    throw new Error(`No MembershipPlan found with id '${id}'.`);
  }
  return client;
});

MembershipPlanSchema.static('list', async function list(options, projection) {
  const newOptions = options || {};
  const docs: IMembershipPlanDocument[] = await this.find(newOptions, projection).sort({
    createdAt: -1,
  });
  return docs;
});

export const MembershipPlanModel =
  (mongoose.models.MembershipPlan as unknown as IMembershipPlanModel) ||
  mongoose.model<IMembershipPlanSchema, IMembershipPlanModel>(
    'MembershipPlan',
    MembershipPlanSchema
  );
