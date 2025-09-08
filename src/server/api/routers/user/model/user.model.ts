import bcrypt from 'bcryptjs';
import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import { imageKitFileSchemaDefinition } from '@/server/api/schemas/common';
import { userProviderSchema } from '@/validations/auth.validation';

import { UserRoleEnum } from '../../auth/constants';
import { cacheUserInfo, clearCachedUserInfo } from '../helper/user.helper';

// Virtuals are not included in the schema type
export interface IUserVirtuals {
  id: string;
  fullName: string;
  orgId: string;
}
export interface IUserSchema extends InferSchemaType<typeof UserSchema>, IUserVirtuals {
  _id: mongoose.Schema.Types.ObjectId;
}

export type IUserSensitiveData = Omit<IUserSchema, '_id'>;
export type IUserData = Omit<IUserSensitiveData, 'hash' | 'salt'>;

// Here, You have to explicity mention the type of methods.
export interface IUserSchemaMethods {
  /**
   *
   * @param password - Password to verify
   * @returns {Promise<boolean>} - True if password is correct, false otherwise
   * */
  verifyPassword(password: string): Promise<boolean>;
  /**
   *
   * @param includeSensitiveData - If true, includes sensitive data like hash and salt. default is false.
   * @returns {IUserData} - User data object
   */
  toClientObject<T extends boolean = false>(
    includeSensitiveData?: T
  ): T extends true ? IUserSensitiveData : IUserData;
}

export interface IUserDocument extends HydratedDocument<IUserSchema, IUserSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface IUserModel extends Model<IUserSchema, {}, IUserSchemaMethods> {
  authenticate(email: string, password: string): Promise<IUserDocument>;
  authenticateWithLoginToken(loginToken: string): Promise<IUserDocument>;
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<IUserDocument>;
  findByEmail(email: string): Promise<IUserDocument>;
  findByVerifiedEmail(email: string): Promise<IUserDocument>;
  list(filter: FilterQuery<IUserSchema>): Promise<IUserDocument[]>;
  changePassword(
    id: string | mongoose.Schema.Types.ObjectId,
    oldPassword: string,
    newPassword: string
  ): Promise<IUserDocument>;
}

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

const UserSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    ownedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    salt: {
      type: String,
    },
    hash: {
      type: String,
    },
    avatar: imageKitFileSchemaDefinition,
    phoneNumber: {
      type: Number,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verifyToken: {
      type: String,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },

    lastLogin: {
      type: Date,
    },

    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      default: UserRoleEnum.USER,
    },

    provider: {
      type: String,
      enum: Object.values(userProviderSchema.enum),
      required: true,
    },

    rawPassword: {
      type: String,
      select: false,
    },

    isOnboardingComplete: {
      type: Boolean,
    },

    loginToken: {
      type: String,
      select: false,
    },
  },
  schemaOptions
);

UserSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

UserSchema.virtual('orgId').get(function getOrgId() {
  if (!this.organization) return null;
  return this.organization.toHexString();
});

UserSchema.virtual('password')
  .get(function get() {
    return this.rawPassword;
  })
  .set(async function set(password: string) {
    this.rawPassword = password;
    const salt = bcrypt.genSaltSync(10);
    this.salt = salt;
    this.hash = bcrypt.hashSync(password, this.salt);
  });

UserSchema.method('toClientObject', function toClientObject(includeSensitiveData = false) {
  const userObj = this.toObject();

  delete userObj.rawPassword;

  if (!includeSensitiveData) {
    delete userObj.salt;
    delete userObj.hash;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { _id: mongoId, ...rest } = userObj;
  return rest;
});

UserSchema.method('verifyPassword', async function verifyPasswordFn(password: string) {
  const hash = this.get('hash');
  if (!hash) return false;
  return bcrypt.compare(password, hash);
});

UserSchema.static('authenticate', async function authenticate(email: string, password: string) {
  const user = await this.findOne({ email }).exec();
  if (!user) {
    throw new Error('Email is not registered.');
  }

  // if (!user.verified) {
  //   throw new Error(
  //     'Please verify your email before signing in. Check your inbox for a verification email.'
  //   );
  // }

  const passwordCorrect = await user.verifyPassword(password);
  if (!passwordCorrect) {
    throw new Error('Invalid email or password.');
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
});

UserSchema.static(
  'authenticateWithLoginToken',
  async function authenticateWithLoginToken(loginToken: string) {
    const user = await this.findOne({ loginToken }).exec();
    if (!user) {
      throw new Error('Invalid login token.');
    }

    // if (!user.verified) {
    //   throw new Error(
    //     'Please verify your email before signing in. Check your inbox for a verification email.'
    //   );
    // }

    user.lastLogin = new Date();
    user.loginToken = undefined;
    await user.save();

    await clearCachedUserInfo(user.id);

    return user;
  }
);

UserSchema.static('get', async function get(id: string) {
  const user = await this.findById(id).exec();
  if (!user) {
    throw new Error(`No User found with id '${id}'.`);
  }
  return user;
});

UserSchema.static('findByEmail', async function findByEmail(email: string) {
  const user = await this.findOne({ email }).exec();
  if (!user) {
    throw new Error(`User with email '${email}' does not exist.`);
  }
  return user;
});

UserSchema.static('findByVerifiedEmail', async function findByVerifiedEmail(email: string) {
  const user = await this.findOne({ email, verified: true }).exec();
  if (!user) {
    throw new Error(`User with email '${email}' does not exist or is not verified.`);
  }
  return user;
});

UserSchema.static('list', async function list(options) {
  const newOptions = options || {};
  const users = await this.find(newOptions).sort({ createdAt: -1 }).select({ salt: 0, hash: 0 });
  return users;
});

UserSchema.static('changePassword', async function changePassword(id, oldPassword, newPassword) {
  const user = await this.findById(id).exec();
  if (!user) {
    throw new Error('No User found with the given id to change password.');
  }

  const passwordCorrect = await user.verifyPassword(oldPassword);
  if (!passwordCorrect) {
    throw new Error('Password did not match the current password.');
  }

  user.set('password', newPassword);
  const updatedUser = await user.save();
  return updatedUser;
});

UserSchema.post('save', async function save(doc: IUserDocument) {
  await cacheUserInfo(doc.toClientObject(false));
});

export const UserModel =
  (mongoose.models.User as unknown as IUserModel) ||
  mongoose.model<IUserSchema, IUserModel>('User', UserSchema);
