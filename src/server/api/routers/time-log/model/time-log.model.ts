import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

// Virtuals are not included in the schema type
export interface ITimeLogVirtuals {
  id: string;
}

export interface ITimeLogSchema extends InferSchemaType<typeof TimeLogSchema>, ITimeLogVirtuals {
  _id: mongoose.Schema.Types.ObjectId;
}

// Here, You have to explicity mention the type of methods.
export interface ITimeLogSchemaMethods {}

export interface ITimeLogDocument extends HydratedDocument<ITimeLogSchema, ITimeLogSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface ITimeLogModel extends Model<ITimeLogSchema, {}, ITimeLogSchemaMethods> {
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<ITimeLogDocument>;
  list(filter?: FilterQuery<ITimeLogSchema>): Promise<ITimeLogDocument[]>;
}

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

const TimeLogSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    checkIn: { type: Date, default: new Date() },
    checkOut: { type: Date },
  },
  schemaOptions
);

TimeLogSchema.static('get', async function get(id: string) {
  const org = await this.findById(id).exec();
  if (!org) {
    throw new Error(`No TimeLog found with id '${id}'.`);
  }
  return org;
});

TimeLogSchema.static('list', async function list(options) {
  const newOptions = options || {};
  const orgs = await this.find({
    ...newOptions,
  }).sort({ createdAt: -1 });
  return orgs;
});

export const TimeLogModel =
  (mongoose.models.TimeLog as unknown as ITimeLogModel) ||
  mongoose.model<ITimeLogSchema, ITimeLogModel>('TimeLog', TimeLogSchema);
