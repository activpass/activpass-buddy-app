import crypto from 'crypto';
import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

// Virtuals are not included in the schema type
export interface ICheckInVirtuals {
  id: string;
}

export interface ICheckInSchema extends InferSchemaType<typeof CheckInSchema>, ICheckInVirtuals {}

// Here, You have to explicity mention the type of methods.
export interface ICheckInSchemaMethods {}

export interface ICheckInDocument extends HydratedDocument<ICheckInSchema, ICheckInSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface ICheckInModel extends Model<ICheckInSchema, {}, ICheckInSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<ICheckInDocument>;
  list(filter?: FilterQuery<ICheckInSchema>): Promise<ICheckInDocument[]>;
}

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

const CheckInSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    pin: {
      type: Number,
      default: () => crypto.randomInt(1000, 9999),
    },
  },
  schemaOptions
);

CheckInSchema.static('get', async function get(id: string) {
  const org = await this.findById(id).exec();
  if (!org) {
    throw new Error(`No CheckIn found with id '${id}'.`);
  }
  return org;
});

CheckInSchema.static('list', async function list(options) {
  const newOptions = options || {};
  const orgs = await this.find({
    ...newOptions,
  }).sort({ createdAt: -1 });
  return orgs;
});

export const CheckInModel =
  (mongoose.models.CheckIn as unknown as ICheckInModel) ||
  mongoose.model<ICheckInSchema, ICheckInModel>('CheckIn', CheckInSchema);
