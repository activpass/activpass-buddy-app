import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

// Virtuals are not included in the schema type
export interface IOnboardClientVirtuals {
  id: string;
}

export interface IOnboardClientSchema
  extends InferSchemaType<typeof OnboardClientSchema>,
    IOnboardClientVirtuals {}

// Here, You have to explicity mention the type of methods.
export interface IOnboardClientSchemaMethods {}

export interface IOnboardClientDocument
  extends HydratedDocument<IOnboardClientSchema, IOnboardClientSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface IOnboardClientModel
  extends Model<IOnboardClientSchema, {}, IOnboardClientSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<IOnboardClientDocument>;
  list(filter?: FilterQuery<IOnboardClientSchema>): Promise<IOnboardClientDocument[]>;
}

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

const OnboardClientSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    onBoarded: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    onBoardedAt: {
      type: Date,
    },
  },
  schemaOptions
);

OnboardClientSchema.static('get', async function get(id: string) {
  const org = await this.findById(id).exec();
  if (!org) {
    throw new Error(`No OnboardClient found with id '${id}'.`);
  }
  return org;
});

OnboardClientSchema.static('list', async function list(options) {
  const newOptions = options || {};
  const orgs = await this.find({
    ...newOptions,
  }).sort({ createdAt: -1 });
  return orgs;
});

export const OnboardClientModel =
  (mongoose.models.OnboardClient as unknown as IOnboardClientModel) ||
  mongoose.model<IOnboardClientSchema, IOnboardClientModel>('OnboardClient', OnboardClientSchema);
