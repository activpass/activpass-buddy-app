import mongoose, { type FilterQuery, Schema } from 'mongoose';

import {
  type IPermissionBase,
  type IPermissionFilter,
  permissionBaseSchema,
} from '@/validations/permission.validation';

import type { IPermissionDocument, IPermissionModel } from './permission.model.types';

// Create native Mongoose schema
const PermissionMongooseSchema = new Schema<IPermissionBase>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => /^[a-z_]+:[a-z_]+:[a-z_]+$/.test(value),
        message:
          'Permission key must follow the pattern "module:resource:action" (e.g., "user:profile:read")',
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Permission name must be at least 3 characters'],
      maxlength: [100, 'Permission name must not exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must not exceed 500 characters'],
    },
    module: {
      type: String,
      required: true,
      enum: [
        'user',
        'admin',
        'billing',
        'content',
        'analytics',
        'system',
        'organization',
        'security',
        'support',
        'inventory',
        'sales',
        'marketing',
        'hr',
        'finance',
        'checkin',
        'checkout',
        'client',
        'employee',
        'role',
        'permission',
      ],
    },
    resource: {
      type: String,
      required: true,
      enum: [
        'profile',
        'users',
        'roles',
        'permissions',
        'organizations',
        'memberships',
        'billing',
        'invoices',
        'payments',
        'subscriptions',
        'content',
        'posts',
        'pages',
        'media',
        'analytics',
        'reports',
        'dashboard',
        'system',
        'settings',
        'configuration',
        'security',
        'audit_logs',
        'support',
        'tickets',
        'inventory',
        'products',
        'sales',
        'orders',
        'marketing',
        'campaigns',
        'hr',
        'employees',
        'finance',
        'transactions',
        'checkins',
        'checkouts',
        'tokens',
        'clients',
        'client_profiles',
      ],
    },
    action: {
      type: String,
      required: true,
      enum: ['create', 'read', 'update', 'delete', 'manage'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'USER_MANAGEMENT',
        'CONTENT_MANAGEMENT',
        'SYSTEM_ADMINISTRATION',
        'REPORTING_ANALYTICS',
        'SECURITY_COMPLIANCE',
        'BILLING_FINANCE',
        'ORGANIZATION_MANAGEMENT',
        'SUPPORT_OPERATIONS',
        'INVENTORY_MANAGEMENT',
        'SALES_MARKETING',
        'HR_MANAGEMENT',
        'CLIENT_MANAGEMENT',
        'CHECKIN_CHECKOUT',
      ],
    },
    priority: {
      type: Number,
      required: true,
      min: [1, 'Priority must be at least 1'],
      max: [10, 'Priority must not exceed 10'],
      default: 5,
    },
    conditions: {
      type: Schema.Types.Mixed,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isSystemDefined: {
      type: Boolean,
      required: true,
      default: false,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  {
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true }, // Include virtuals in object output
    versionKey: false, // Hide __v property
    timestamps: true, // Add createdAt and updatedAt
  }
);

// Indexes for performance optimization
PermissionMongooseSchema.index({ key: 1 }, { unique: true }); // Unique permission keys
PermissionMongooseSchema.index({ module: 1, resource: 1, action: 1 }); // Compound index for hierarchy
PermissionMongooseSchema.index({ category: 1 }); // Category filtering
PermissionMongooseSchema.index({ isActive: 1 }); // Status filtering
PermissionMongooseSchema.index({ isSystemDefined: 1 }); // Type filtering
PermissionMongooseSchema.index({ organizationId: 1 }); // Organization context
PermissionMongooseSchema.index({ priority: 1 }); // Priority ordering
PermissionMongooseSchema.index({ createdAt: -1 }); // Date ordering
PermissionMongooseSchema.index({ updatedAt: -1 }); // Last modified
PermissionMongooseSchema.index({ name: 'text', description: 'text' }); // Text search

// Virtual for display path
PermissionMongooseSchema.virtual('displayPath').get(function displayPath() {
  return `${this.module} › ${this.resource} › ${this.action}`;
});

// Instance Methods
PermissionMongooseSchema.methods.matchesPattern = function matchesPattern(
  pattern: string
): boolean {
  if (!pattern) return true;

  const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');
  return regex.test(this.key) || regex.test(this.name) || regex.test(this.description || '');
};

PermissionMongooseSchema.methods.isHigherThan = function isHigherThan(
  otherPermission: IPermissionDocument
): boolean {
  return this.priority < otherPermission.priority; // Lower number = higher priority
};

PermissionMongooseSchema.methods.getDisplayPath = function getDisplayPath(): string {
  return `${this.module} › ${this.resource} › ${this.action}`;
};

// Static Methods
PermissionMongooseSchema.statics.findWithPagination = async function findWithPagination(
  filter: IPermissionFilter
) {
  const {
    search,
    module,
    resource,
    action,
    category,
    isActive,
    isSystemDefined,
    organizationId,
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc',
  } = filter;

  // Build query
  const query: FilterQuery<IPermissionBase> = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { key: { $regex: search, $options: 'i' } },
    ];
  }

  if (module) query.module = module;
  if (resource) query.resource = resource;
  if (action) query.action = action;
  if (category) query.category = category;
  if (typeof isActive === 'boolean') query.isActive = isActive;
  if (typeof isSystemDefined === 'boolean') query.isSystemDefined = isSystemDefined;
  if (organizationId) query.organizationId = organizationId;

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Build sort object
  const sort: Record<string, 1 | -1> = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute queries
  const [permissions, total] = await Promise.all([
    this.find(query).sort(sort).skip(skip).limit(limit).exec(),
    this.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    permissions,
    total,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

PermissionMongooseSchema.statics.findByModule = async function findByModule(module: string) {
  return this.find({ module, isActive: true }).sort({ priority: 1, name: 1 }).exec();
};

PermissionMongooseSchema.statics.findByResource = async function findByResource(resource: string) {
  return this.find({ resource, isActive: true }).sort({ priority: 1, name: 1 }).exec();
};

PermissionMongooseSchema.statics.findByCategory = async function findByCategory(category: string) {
  return this.find({ category, isActive: true }).sort({ priority: 1, name: 1 }).exec();
};

PermissionMongooseSchema.statics.keyExists = async function keyExists(
  key: string,
  excludeId?: string
) {
  const query: FilterQuery<IPermissionBase> = { key };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const count = await this.countDocuments(query);
  return count > 0;
};

PermissionMongooseSchema.statics.getModules = async function getModules() {
  const modules = await this.distinct('module', { isActive: true });
  return modules.sort();
};

PermissionMongooseSchema.statics.getResources = async function getResources() {
  const resources = await this.distinct('resource', { isActive: true });
  return resources.sort();
};

PermissionMongooseSchema.statics.getActions = async function getActions() {
  const actions = await this.distinct('action', { isActive: true });
  return actions.sort();
};

PermissionMongooseSchema.statics.findByKey = async function findByKey(key: string) {
  return this.findOne({ key }).exec();
};

PermissionMongooseSchema.statics.createMany = async function createMany(
  permissions: Partial<IPermissionBase>[]
) {
  return this.insertMany(permissions, { ordered: false });
};

PermissionMongooseSchema.statics.createSystemPermissions =
  async function createSystemPermissions() {
    const { DEFAULT_SYSTEM_PERMISSIONS } = await import(
      '../../../../../validations/permission.validation'
    );

    const existingPermissions: IPermissionDocument[] = await this.find({
      key: { $in: DEFAULT_SYSTEM_PERMISSIONS.map(p => p.key!) },
    }).exec();

    const existingKeys = new Set(existingPermissions.map(p => p.key));
    const newPermissions = DEFAULT_SYSTEM_PERMISSIONS.filter(p => !existingKeys.has(p.key!));

    if (newPermissions.length > 0) {
      await this.insertMany(newPermissions);
    }
  };

// Pre-save middleware to auto-generate module, resource, action from key
PermissionMongooseSchema.pre('save', function save(next) {
  if (this.key && (!this.module || !this.resource || !this.action)) {
    const [module, resource, action] = this.key.split(':');
    if (module && resource && action) {
      this.module = module as typeof this.module;
      this.resource = resource as typeof this.resource;
      this.action = action as typeof this.action;
    }
  }
  next();
});

// Pre-save middleware to validate key uniqueness
PermissionMongooseSchema.pre('save', async function save(next) {
  if (this.isModified('key')) {
    const exists = await (this.constructor as IPermissionModel).keyExists(
      this.key,
      this._id?.toString()
    );
    if (exists) {
      const error = new Error(`Permission with key '${this.key}' already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  return next();
});

export const PermissionModel: IPermissionModel =
  (mongoose.models.Permission as unknown as IPermissionModel) ||
  mongoose.model('Permission', PermissionMongooseSchema);

// Validation functions using Zod
export const validatePermissionInput = (data: unknown) => {
  return permissionBaseSchema.safeParse(data);
};

export const validatePermissionUpdate = (data: unknown) => {
  return permissionBaseSchema.partial().safeParse(data);
};
