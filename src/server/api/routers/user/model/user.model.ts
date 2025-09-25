import bcrypt from 'bcryptjs';
import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import { imageKitFileSchemaDefinition } from '@/server/api/schemas/common';
import { userProviderSchema } from '@/validations/auth.validation';
import {
  GenderEnum,
  RelationshipEnum,
  WorkdaysEnum,
  type WorkdaysEnumType,
} from '@/validations/employee/add-form.validation';

import { RoleModel } from '../../role/model/role.model';
import { type IRoleDocument } from '../../role/model/role.model.types';
import { cacheUserInfo, clearCachedUserInfo } from '../helper/user.helper';

// Virtuals are not included in the schema type
export interface IUserVirtuals {
  id: string;
  fullName: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserBaseSchema = InferSchemaType<typeof UserSchema>;
export interface IUserSchema extends IUserBaseSchema, IUserVirtuals {
  _id: mongoose.Schema.Types.ObjectId;
  // Employee-specific fields - these are already defined in the schema
  // so they don't need to be redefined here

  workSchedule?: IUserBaseSchema['workSchedule'] & {
    workDays: WorkdaysEnumType[] | undefined;
  };
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
  /**
   * Get the user's role document with permissions
   * @returns {Promise<IRoleDocument | null>} - Role document or null if no role reference
   */
  getRole(): Promise<IRoleDocument | null>;
  /**
   * Check if user has a specific permission
   * @param permission - Permission string to check
   * @returns {Promise<boolean>} - True if user has permission
   */
  hasPermission(permission: string): Promise<boolean>;
  /**
   * Check if user can manage another user based on role hierarchy
   * @param targetUser - Target user to check management capability
   * @returns {Promise<boolean>} - True if user can manage target user
   */
  canManage(targetUser: IUserDocument): Promise<boolean>;
}

export interface IUserDocument extends HydratedDocument<IUserSchema, IUserSchemaMethods> {}

// Here, You have to explicity mention the type of statics.
export interface IUserModel extends Model<IUserSchema, {}, IUserSchemaMethods> {
  authenticate(email: string, password: string): Promise<IUserDocument>;
  authenticateWithLoginToken(loginToken: string): Promise<IUserDocument>;
  get(id: string | mongoose.Schema.Types.ObjectId): Promise<IUserDocument>;
  findByEmail(email: string, orgId?: string): Promise<IUserDocument>;
  findByPhoneNumber(phoneNumber: number, orgId?: string): Promise<IUserDocument>; // --- IGNORE ---
  findByVerifiedEmail(email: string, orgId?: string): Promise<IUserDocument>;
  list(filter: FilterQuery<IUserSchema>): Promise<IUserDocument[]>;
  changePassword(
    id: string | mongoose.Schema.Types.ObjectId,
    oldPassword: string,
    newPassword: string
  ): Promise<IUserDocument>;
  findByRole(roleValue: string, orgId?: string): Promise<IUserDocument[]>;
  findByPermission(permission: string, orgId?: string): Promise<IUserDocument[]>;
  assignRole(userId: string, roleId: string): Promise<IUserDocument>;
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      // required: true,
    },

    provider: {
      type: String,
      enum: Object.values(userProviderSchema.enum),
      required: true,
    },

    isOnboardingComplete: {
      type: Boolean,
    },

    loginToken: {
      type: String,
      select: false,
    },

    // Employee-specific fields
    employeeCode: { type: String, unique: true, sparse: true }, // Employee code, can be null but must be unique if present
    gender: {
      type: String,
      enum: Object.values(GenderEnum.enum),
    },
    dob: { type: Date },
    address: { type: String },
    designation: { type: String },

    emergencyContact: {
      name: { type: String },
      relationship: {
        type: String,
        enum: Object.values(RelationshipEnum.enum),
      },
      gender: {
        type: String,
        enum: Object.values(GenderEnum.enum),
      },
      phoneNumber: { type: Number },
      email: { type: String },
      address: { type: String },
    },

    bank: {
      name: { type: String },
      accountHolderName: { type: String },
      accountNumber: { type: Number },
      branchName: { type: String },
      ifscCode: { type: String },
    },
    jobDetails: {
      title: { type: String },
      department: { type: String },
      description: { type: String },
      joiningDate: { type: Date },
      reportTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },

    workSchedule: {
      workDays: {
        type: [String],
        enum: Object.values(WorkdaysEnum.enum),
      },
      shiftStartTime: { type: String },
      shiftEndTime: { type: String },
      breakHours: { type: Number },
      entitledHolidays: { type: Number },
    },

    payroll: {
      grossSalary: { type: String },
      dateOfSalary: { type: Date },
      benefits: { type: [String] },
      compensation: { type: [String] },
    },

    leaves: {
      casual: {
        total: { type: Number, default: 12 },
        used: { type: Number, default: 0 },
      },
      medical: {
        total: { type: Number, default: 12 },
        used: { type: Number, default: 0 },
      },
      earned: {
        total: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
      },
    },

    notificationPreferences: {
      email: { type: Boolean },
      all: { type: Boolean },
      client: { type: Boolean },
      employee: { type: Boolean },
      finance: { type: Boolean },
      membership: { type: Boolean },
      isTwoFactorAuthEnabled: { type: Boolean },
      isEmailRecoveryEnabled: { type: Boolean },
      isMobileNumberRecoveryEnabled: { type: Boolean },
    },

    checkInDate: { type: Date },
    checkOutDate: { type: Date },

    isDeleted: { type: Boolean, default: false },
  },
  schemaOptions
);

UserSchema.index(
  { email: 1, organization: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } }
);
UserSchema.index({ employeeCode: 1 }, { unique: true, sparse: true });

UserSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

UserSchema.virtual('orgId').get(function getOrgId() {
  if (!this.organization) return null;
  return this.organization.toHexString();
});

UserSchema.virtual('password').set(async function set(password: string) {
  const salt = bcrypt.genSaltSync(10);
  this.salt = salt;
  this.hash = bcrypt.hashSync(password, this.salt);
});

UserSchema.method('toClientObject', function toClientObject(includeSensitiveData = false) {
  const userObj = this.toObject();

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

// Role-related instance methods
UserSchema.method('getRole', async function getRole() {
  if (!this.role) return null;
  return RoleModel.findById(this.role).exec();
});

UserSchema.method('hasPermission', async function hasPermission(permission: string) {
  const roleDoc = await (this as unknown as IUserDocument).getRole();
  if (!roleDoc) return false;

  // Check for wildcard permission
  if (roleDoc.permissions && roleDoc.permissions.includes('all:*')) {
    return true;
  }

  // Check for specific permission
  return roleDoc.permissions ? roleDoc.permissions.includes(permission) : false;
});

UserSchema.method('canManage', async function canManage(targetUser: IUserDocument) {
  const userRole = await (this as unknown as IUserDocument).getRole();
  const targetRole = await targetUser.getRole();

  if (!userRole || !targetRole) {
    return false;
  }

  // Users can manage users with higher hierarchy levels (lower level numbers)
  return userRole.level < targetRole.level;
});

UserSchema.static('authenticate', async function authenticate(email: string, password: string) {
  const user = await (this as unknown as IUserModel).findOne({ email }).exec();
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

UserSchema.static('findByEmail', async function findByEmail(email: string, orgId?: string) {
  const query: FilterQuery<IUserSchema> = {
    email,
    isDeleted: {
      $ne: true,
    },
  };
  if (orgId) {
    query.organization = orgId;
  }
  const user = await this.findOne(query).exec();
  if (!user) {
    throw new Error(`User with email '${email}' does not exist.`);
  }
  return user;
});

UserSchema.static(
  'findByPhoneNumber',
  async function findByPhoneNumber(phoneNumber: number, orgId?: string) {
    const query: FilterQuery<IUserSchema> = {
      phoneNumber,
      isDeleted: {
        $ne: true,
      },
    };
    if (orgId) {
      query.organization = orgId;
    }
    const user = await this.findOne(query).exec();
    if (!user) {
      throw new Error(`User with phone number '${phoneNumber}' does not exist.`);
    }
    return user;
  }
);

UserSchema.static(
  'findByVerifiedEmail',
  async function findByVerifiedEmail(email: string, orgId?: string) {
    const query: FilterQuery<IUserSchema> = { email, verified: true };
    if (orgId) {
      query.organization = orgId;
    }
    const user = await this.findOne(query).exec();
    if (!user) {
      throw new Error(`User with email '${email}' does not exist or is not verified.`);
    }
    return user;
  }
);

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

// Role-related static methods
UserSchema.static('findByRole', async function findByRole(roleKey: string, orgId?: string) {
  const role = await RoleModel.findOne({
    key: roleKey,
    isActive: true,
    ...(orgId && { organization: orgId }),
  }).exec();

  if (!role) return [];

  const query: FilterQuery<IUserSchema> = { role: role._id };
  if (orgId) {
    query.organization = orgId;
  }

  return this.find(query).populate('role').exec();
});

UserSchema.static(
  'findByPermission',
  async function findByPermission(permission: string, orgId?: string) {
    const roles = await RoleModel.find({
      $or: [{ permissions: 'all:*' }, { permissions: permission }],
      isActive: true,
      ...(orgId && { organization: orgId }),
    }).exec();

    if (roles.length === 0) return [];

    const roleIds = roles.map(role => role._id);
    const query: FilterQuery<IUserSchema> = { role: { $in: roleIds } };
    if (orgId) {
      query.organization = orgId;
    }

    return this.find(query).populate('role').exec();
  }
);

UserSchema.static('assignRole', async function assignRole(userId: string, roleId: string) {
  const user = await this.findById(userId).exec();
  if (!user) {
    throw new Error('User not found');
  }

  user.role = new mongoose.Types.ObjectId(roleId);
  await user.save();
  return user;
});

UserSchema.post('save', async function save(doc: IUserDocument) {
  await cacheUserInfo(doc.toClientObject(false));
});

export const UserModel =
  (mongoose.models.User as unknown as IUserModel) ||
  mongoose.model<IUserSchema, IUserModel>('User', UserSchema);
