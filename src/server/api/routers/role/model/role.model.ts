import mongoose, { type FilterQuery, Schema } from 'mongoose';

import { logger } from '@/server/logger';
import {
  DEFAULT_SYSTEM_ROLES,
  type IRoleBase,
  type IRoleFilter,
  type IRoleSchema,
  roleBaseSchema,
  type RoleLevel,
} from '@/validations/role.validation';

import type { IRoleDocument, IRoleHierarchyNode, IRoleModel } from './role.model.types';

// Create native Mongoose schema
const RoleMongooseSchema = new Schema<IRoleBase>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => /^[a-z_]+:[a-z_]+$/.test(value),
        message:
          'Role key must follow the pattern "namespace:role" (e.g., "sys:admin", "org:admin")',
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Role name must be at least 2 characters'],
      maxlength: [100, 'Role name must not exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must not exceed 500 characters'],
    },
    type: {
      type: String,
      required: true,
      enum: ['SYSTEM', 'ORGANIZATION', 'CUSTOM'],
      default: 'CUSTOM',
    },
    level: {
      type: String,
      required: true,
      enum: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'VIEWER'],
      default: 'EMPLOYEE',
    },
    priority: {
      type: Number,
      required: true,
      min: [1, 'Priority must be at least 1'],
      max: [100, 'Priority must not exceed 100'],
      default: 50,
    },
    permissions: {
      type: [String],
      default: [],
    },
    inheritsFrom: {
      type: [String],
      default: [],
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
    isCreatorRole: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDefaultRole: {
      type: Boolean,
      required: true,
      default: false,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    maxMembers: {
      type: Number,
      min: [0, 'Max members must be at least 0'],
    },
    validFrom: {
      type: Date,
    },
    validUntil: {
      type: Date,
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
RoleMongooseSchema.index({ key: 1 }, { unique: true }); // Unique role keys
RoleMongooseSchema.index({ type: 1 }); // Type filtering
RoleMongooseSchema.index({ level: 1 }); // Level filtering
RoleMongooseSchema.index({ isActive: 1 }); // Status filtering
RoleMongooseSchema.index({ isSystemDefined: 1 }); // System vs custom
RoleMongooseSchema.index({ isCreatorRole: 1 }); // Creator role lookup
RoleMongooseSchema.index({ isDefaultRole: 1 }); // Default role lookup
RoleMongooseSchema.index({ organizationId: 1 }); // Organization context
RoleMongooseSchema.index({ priority: 1 }); // Priority ordering
RoleMongooseSchema.index({ permissions: 1 }); // Permission association
RoleMongooseSchema.index({ inheritsFrom: 1 }); // Inheritance lookup
RoleMongooseSchema.index({ createdAt: -1 }); // Date ordering
RoleMongooseSchema.index({ name: 'text', description: 'text' }); // Text search

// Virtual for member count (will be populated by aggregation)
RoleMongooseSchema.virtual('memberCount').get(function memberCount(this: IRoleDocument) {
  return this._memberCount || 0;
});

// Virtual for effective permissions count
RoleMongooseSchema.virtual('effectivePermissionCount').get(function effectivePermissionCount(
  this: IRoleDocument
) {
  return this._effectivePermissionCount || this.permissions?.length || 0;
});

// Instance Methods
RoleMongooseSchema.methods.hasPermission = function hasPermission(permissionId: string): boolean {
  return this.permissions.includes(permissionId);
};

RoleMongooseSchema.methods.getEffectivePermissions =
  async function getEffectivePermissions(): Promise<string[]> {
    const visitedRoles = new Set<string>();
    const allPermissions = new Set<string>();

    const collectPermissions = async (roleId: string) => {
      if (visitedRoles.has(roleId)) return; // Prevent infinite loops
      visitedRoles.add(roleId);

      const role = await (this.constructor as IRoleModel).findById(roleId).exec();
      if (!role || !role.isActive) return;

      // Add direct permissions
      role.permissions.forEach((permId: string) => allPermissions.add(permId));

      // Recursively collect inherited permissions in parallel
      await Promise.all(role.inheritsFrom.map(parentId => collectPermissions(parentId)));
    };

    await collectPermissions(this._id.toString());
    return Array.from(allPermissions);
  };

RoleMongooseSchema.methods.isHigherThan = function isHigherThan(otherRole: IRoleDocument): boolean {
  return this.priority < otherRole.priority; // Lower number = higher priority
};

RoleMongooseSchema.methods.addPermissions = async function addPermissions(
  permissionIds: string[]
): Promise<IRoleDocument> {
  const newPermissions = Array.from(new Set([...this.permissions, ...permissionIds]));
  this.permissions = newPermissions;
  return this.save();
};

RoleMongooseSchema.methods.removePermissions = async function removePermissions(
  permissionIds: string[]
): Promise<IRoleDocument> {
  this.permissions = this.permissions.filter((id: string) => !permissionIds.includes(id));
  return this.save();
};

RoleMongooseSchema.methods.addParentRoles = async function addParentRoles(
  parentRoleIds: string[]
): Promise<IRoleDocument> {
  // Validate hierarchy before adding - check all in parallel
  const canInheritChecks = await Promise.all(
    parentRoleIds.map(parentId => this.canInheritFrom(parentId))
  );

  // Check if any inheritance would be invalid
  const invalidIndex = canInheritChecks.findIndex(canInherit => !canInherit);
  if (invalidIndex !== -1) {
    throw new Error(
      `Cannot inherit from role ${parentRoleIds[invalidIndex]} - would create circular inheritance`
    );
  }

  const newParents = Array.from(new Set([...this.inheritsFrom, ...parentRoleIds]));
  this.inheritsFrom = newParents;
  return this.save();
};

RoleMongooseSchema.methods.removeParentRoles = async function removeParentRoles(
  parentRoleIds: string[]
): Promise<IRoleDocument> {
  this.inheritsFrom = this.inheritsFrom.filter((id: string) => !parentRoleIds.includes(id));
  return this.save();
};

RoleMongooseSchema.methods.canInheritFrom = async function canInheritFrom(
  parentRoleId: string
): Promise<boolean> {
  // Check if parent role exists and is active
  const parentRole = await (this.constructor as IRoleModel).findById(parentRoleId).exec();
  if (!parentRole || !parentRole.isActive) return false;

  // Check for circular inheritance
  const checkCircular = async (
    roleId: string,
    targetId: string,
    visited: Set<string> = new Set()
  ): Promise<boolean> => {
    if (visited.has(roleId)) return true; // Circular reference detected
    if (roleId === targetId) return true; // Direct circular reference

    visited.add(roleId);

    const role = await (this.constructor as IRoleModel).findById(roleId).exec();
    if (!role) return false;

    // Check all parent roles in parallel
    const parentChecks = await Promise.all(
      role.inheritsFrom.map(parentId => checkCircular(parentId, targetId, new Set(visited)))
    );

    return parentChecks.some(hasCircular => hasCircular);
  };

  return !(await checkCircular(parentRoleId, this._id.toString()));
};

RoleMongooseSchema.methods.getDisplayInfo = function getDisplayInfo() {
  return {
    name: this.name,
    level: this.level,
    permissionCount: this.permissions?.length || 0,
    inheritanceChain: this.inheritsFrom,
  };
};

// Static Methods
RoleMongooseSchema.static(
  'findWithPagination',
  async function findWithPagination(filter: IRoleFilter) {
    const {
      search,
      type,
      level,
      isActive,
      isSystemDefined,
      isCreatorRole,
      isDefaultRole,
      organizationId,
      hasPermissions,
      permissionId,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
    } = filter;

    // Build query
    const query: FilterQuery<IRoleBase> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { key: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) query.type = type;
    if (level) query.level = level;
    if (typeof isActive === 'boolean') query.isActive = isActive;
    if (typeof isSystemDefined === 'boolean') query.isSystemDefined = isSystemDefined;
    if (typeof isCreatorRole === 'boolean') query.isCreatorRole = isCreatorRole;
    if (typeof isDefaultRole === 'boolean') query.isDefaultRole = isDefaultRole;
    if (organizationId) query.organizationId = organizationId;
    if (typeof hasPermissions === 'boolean') {
      query.permissions = hasPermissions ? { $ne: [] } : { $eq: [] };
    }
    if (permissionId) query.permissions = permissionId;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [roles, total] = await Promise.all([
      this.find(query).sort(sort).skip(skip).limit(limit).exec(),
      this.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      roles,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
);

RoleMongooseSchema.statics.findByType = async function findByType(type: string) {
  return this.find({ type, isActive: true }).sort({ priority: 1, name: 1 }).exec();
};

RoleMongooseSchema.statics.findByLevel = async function findByLevel(level: RoleLevel) {
  return this.find({ level, isActive: true }).sort({ priority: 1, name: 1 }).exec();
};

RoleMongooseSchema.statics.findWithPermission = async function findWithPermission(
  permissionId: string
) {
  return this.find({ permissions: permissionId, isActive: true })
    .sort({ priority: 1, name: 1 })
    .exec();
};

RoleMongooseSchema.statics.keyExists = async function keyExists(key: string, excludeId?: string) {
  const query: FilterQuery<IRoleBase> = { key };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const count = await this.countDocuments(query);
  return count > 0;
};

RoleMongooseSchema.statics.getCreatorRole = async function getCreatorRole() {
  return this.findOne({ isCreatorRole: true, isActive: true }).exec();
};

RoleMongooseSchema.statics.getDefaultRole = async function getDefaultRole() {
  return this.findOne({ isDefaultRole: true, isActive: true }).exec();
};

RoleMongooseSchema.statics.setCreatorRole = async function setCreatorRole(roleId: string) {
  // Remove creator flag from all roles
  await this.updateMany({}, { isCreatorRole: false });
  // Set new creator role
  await this.findByIdAndUpdate(roleId, { isCreatorRole: true });
};

RoleMongooseSchema.statics.setDefaultRole = async function setDefaultRole(roleId: string) {
  // Remove default flag from all roles
  await this.updateMany({}, { isDefaultRole: false });
  // Set new default role
  await this.findByIdAndUpdate(roleId, { isDefaultRole: true });
};

RoleMongooseSchema.statics.findByKey = async function findByKey(key: string) {
  return this.findOne({ key }).exec();
};

RoleMongooseSchema.statics.createSystemRoles = async function createSystemRoles() {
  const existingRoles: IRoleDocument[] = await this.find({
    key: { $in: DEFAULT_SYSTEM_ROLES.map(r => r.key!) },
  }).exec();

  const existingKeys = new Set(existingRoles.map(r => r.key));
  const newRoles = DEFAULT_SYSTEM_ROLES.filter(r => !existingKeys.has(r.key!));
  if (newRoles.length > 0) {
    try {
      await this.insertMany(newRoles, { ordered: false });
    } catch (error) {
      logger.error('Error creating system roles:', error);
      throw error;
    }
  }
};

RoleMongooseSchema.statics.getHierarchyTree = async function getHierarchyTree(): Promise<
  IRoleHierarchyNode[]
> {
  const roles: IRoleSchema[] = await this.find({ isActive: true }).lean().exec();
  const roleMap: Record<string, IRoleHierarchyNode> = {};

  // Initialize role map - convert lean documents to hierarchy nodes
  roles.forEach(role => {
    const roleId = role.id;
    roleMap[roleId] = {
      ...role,
      _id: roleId,
      children: [],
    } as IRoleHierarchyNode;
  });

  const tree: IRoleHierarchyNode[] = [];

  // Build tree structure
  roles.forEach(role => {
    const roleId = role.id;
    const roleNode = roleMap[roleId];

    if (!roleNode) return; // Skip if role node doesn't exist

    if (!role.inheritsFrom || role.inheritsFrom.length === 0) {
      // Root role - has no parents
      tree.push(roleNode);
    } else {
      // Child role - add to parent(s)
      role.inheritsFrom.forEach((parentId: string) => {
        const parentNode = roleMap[parentId];
        if (parentNode) {
          parentNode.children.push(roleNode);
        }
      });
    }
  });

  return tree;
};

RoleMongooseSchema.statics.validateHierarchy = async function validateHierarchy(
  roleId: string,
  parentIds: string[]
) {
  // Check for circular inheritance
  const checkCircular = async (
    currentId: string,
    targetId: string,
    visited: Set<string> = new Set()
  ): Promise<boolean> => {
    if (visited.has(currentId)) return true;
    if (currentId === targetId) return true;

    visited.add(currentId);

    const role: IRoleDocument = await this.findById(currentId).exec();
    if (!role) return false;

    const parentChecks = await Promise.all(
      role.inheritsFrom.map(parentId => checkCircular(parentId, targetId, new Set(visited)))
    );
    if (parentChecks.some(isCircular => isCircular)) {
      return true;
    }

    return false;
  };

  // Check all parent IDs for circular inheritance in parallel
  const circularChecks = await Promise.all(
    parentIds.map(parentId => checkCircular(parentId, roleId))
  );

  // Return false if any check indicates circular inheritance
  return !circularChecks.some(isCircular => isCircular);
};

RoleMongooseSchema.statics.findChildRoles = async function findChildRoles(parentRoleId: string) {
  return this.find({ inheritsFrom: parentRoleId, isActive: true }).exec();
};

RoleMongooseSchema.statics.updateMemberCount = async function updateMemberCount(
  roleId: string,
  delta: number
) {
  await this.findByIdAndUpdate(roleId, { $inc: { memberCount: delta } });
};

RoleMongooseSchema.statics.bulkAssignPermissions = async function bulkAssignPermissions(
  assignments: Array<{ roleId: string; permissionIds: string[] }>
) {
  const bulkOps = assignments.map(({ roleId, permissionIds }) => ({
    updateOne: {
      filter: { _id: roleId },
      update: { $set: { permissions: permissionIds } },
    },
  }));

  await this.bulkWrite(bulkOps);
};

// Pre-save middleware to validate unique creator and default roles
RoleMongooseSchema.pre('save', async function save(next) {
  if (this.isModified('isCreatorRole') && this.isCreatorRole) {
    await (this.constructor as IRoleModel).updateMany(
      { _id: { $ne: this._id } },
      { isCreatorRole: false }
    );
  }

  if (this.isModified('isDefaultRole') && this.isDefaultRole) {
    await (this.constructor as IRoleModel).updateMany(
      { _id: { $ne: this._id } },
      { isDefaultRole: false }
    );
  }

  next();
});

// Pre-save middleware to validate key uniqueness
RoleMongooseSchema.pre('save', async function save(next) {
  if (this.isModified('key')) {
    const exists = await (this.constructor as IRoleModel).keyExists(this.key, this._id?.toString());
    if (exists) {
      const error = new Error(`Role with key '${this.key}' already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  return next();
});

export const RoleModel: IRoleModel =
  (mongoose.models.Role as IRoleModel) ||
  (mongoose.model('Role', RoleMongooseSchema) as IRoleModel);

// Validation functions using Zod
export const validateRoleInput = (data: unknown) => {
  return roleBaseSchema.safeParse(data);
};

export const validateRoleUpdate = (data: unknown) => {
  return roleBaseSchema.partial().safeParse(data);
};
