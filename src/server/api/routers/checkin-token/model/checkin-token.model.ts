import crypto from 'crypto';
import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

// Virtuals are not included in the schema type
export interface ICheckinTokenVirtuals {
  id: string;
}

export interface ICheckinTokenSchema
  extends InferSchemaType<typeof CheckinTokenSchema>,
    ICheckinTokenVirtuals {
  _id: mongoose.Schema.Types.ObjectId;
}

// Here, You have to explicity mention the type of methods.
export interface ICheckinTokenSchemaMethods {}

export interface ICheckinTokenDocument
  extends HydratedDocument<ICheckinTokenSchema, ICheckinTokenSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface ICheckinTokenModel
  extends Model<ICheckinTokenSchema, {}, ICheckinTokenSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<ICheckinTokenDocument>;
  list(filter?: FilterQuery<ICheckinTokenSchema>): Promise<ICheckinTokenDocument[]>;
}

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

const CheckinTokenSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    otp: {
      type: Number,
      default: () => crypto.randomInt(1000, 9999),
    },
  },
  schemaOptions
);

CheckinTokenSchema.static('get', async function get(id: string) {
  const org = await this.findById(id).exec();
  if (!org) {
    throw new Error(`No CheckinToken found with id '${id}'.`);
  }
  return org;
});

CheckinTokenSchema.static('list', async function list(options) {
  const newOptions = options || {};
  const orgs = await this.find({
    ...newOptions,
  }).sort({ createdAt: -1 });
  return orgs;
});

export const CheckinTokenModel =
  (mongoose.models.CheckinToken as unknown as ICheckinTokenModel) ||
  mongoose.model<ICheckinTokenSchema, ICheckinTokenModel>('CheckinToken', CheckinTokenSchema);
