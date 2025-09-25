import mongoose, { type FilterQuery, Schema } from 'mongoose';

import {
  calculateExpirationDate,
  DEFAULT_ONBOARDING_CHECKLIST,
  generateOnboardingToken,
  getExpirationStatus,
  isTokenExpired,
} from '../helper/onboard-employee.helper';
import {
  type IOnboardEmployeeFilter,
  type OnboardEmployeeStatus,
  OnboardEmployeeStatusEnum,
} from '../onboard-employee.input';
import {
  type IOnboardEmployeeBase,
  type IOnboardEmployeeDocument,
  type IOnboardEmployeeModel,
  type IOnboardEmployeePaginationResult,
  type IOnboardEmployeeSchema,
} from './onboard-employee.model.types';

const schemaOptions = {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `toObject()` output includes virtuals,
  versionKey: false, // hide __v property
  timestamps: true,
};

// Create the Mongoose schema using native Mongoose Schema
const OnboardEmployeeMongooseSchema = new Schema<IOnboardEmployeeSchema>(
  {
    // Organization reference
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },

    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },

    // Unique token for onboarding verification
    token: {
      type: String,
      required: true,
      unique: true,
      minlength: 32,
      maxlength: 128,
      index: true,
    },

    // Token expiration date
    expiresAt: {
      type: Date,
      required: true,
    },

    // Onboarding status
    status: {
      type: String,
      enum: Object.values(OnboardEmployeeStatusEnum.enum),
      default: 'PENDING',
      index: true,
    },

    // Whether employee has been verified (clicked link/used token)
    verified: {
      type: Boolean,
      default: false,
    },

    // Whether employee has completed onboarding
    onBoarded: {
      type: Boolean,
      default: false,
    },

    // Date when employee completed onboarding
    onBoardedAt: {
      type: Date,
      default: null,
    },

    // Date when employee first verified their token
    verifiedAt: {
      type: Date,
      default: null,
    },

    // Start date
    startDate: {
      type: Date,
      default: null,
    },

    // Onboarding notes
    notes: {
      type: String,
      maxlength: 1000,
      default: null,
    },

    // Onboarding checklist completion
    checklistCompleted: {
      type: Schema.Types.Mixed,
      default: () => ({ ...DEFAULT_ONBOARDING_CHECKLIST }),
    },

    // Number of reminder emails sent
    remindersSent: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Last reminder sent date
    lastReminderSent: {
      type: Date,
      default: null,
    },

    // Maximum number of reminders allowed
    maxReminders: {
      type: Number,
      min: 0,
      max: 10,
      default: 3,
    },

    // Whether to send reminder emails
    sendReminders: {
      type: Boolean,
      default: true,
    },

    // Metadata for extensibility
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },

    // Created by (HR/Admin who initiated onboarding)
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Updated by (last user to modify the onboarding record)
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  schemaOptions
);

// Indexes for performance optimization
OnboardEmployeeMongooseSchema.index({ token: 1 }, { unique: true }); // Unique token lookup
OnboardEmployeeMongooseSchema.index({ organization: 1 }); // Organization filtering
OnboardEmployeeMongooseSchema.index({ createdBy: 1 }); // User filtering
OnboardEmployeeMongooseSchema.index({ status: 1 }); // Status filtering

// Virtual for checking if token is expired
OnboardEmployeeMongooseSchema.virtual('isExpired').get(function isExpired(
  this: IOnboardEmployeeDocument
) {
  return isTokenExpired(this.expiresAt);
});

// Virtual for expiration status
OnboardEmployeeMongooseSchema.virtual('expirationStatus').get(function expirationStatus(
  this: IOnboardEmployeeDocument
) {
  return getExpirationStatus(this.expiresAt);
});

// Virtual for days until expiration
OnboardEmployeeMongooseSchema.virtual('daysUntilExpiration').get(function daysUntilExpiration(
  this: IOnboardEmployeeDocument
) {
  const now = new Date();
  const timeDiff = this.expiresAt.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual for onboarding completion percentage
OnboardEmployeeMongooseSchema.virtual('completionPercentage').get(function completionPercentage(
  this: IOnboardEmployeeDocument
) {
  const totalItems = Object.keys(this.checklistCompleted || {}).length;
  if (totalItems === 0) return 0;

  const completedItems = Object.values(this.checklistCompleted || {}).filter(Boolean).length;
  return Math.round((completedItems / totalItems) * 100);
});

// Instance Methods
OnboardEmployeeMongooseSchema.methods.verify =
  async function verify(): Promise<IOnboardEmployeeDocument> {
    if (this.isExpired) {
      throw new Error('Onboarding token has expired');
    }

    this.verified = true;
    this.verifiedAt = new Date();

    if (this.status === 'PENDING') {
      this.status = 'IN_PROGRESS';
    }

    return this.save();
  };

OnboardEmployeeMongooseSchema.methods.complete = async function complete(
  checklistData?: Record<string, boolean>
): Promise<IOnboardEmployeeDocument> {
  if (!this.verified) {
    throw new Error('Employee must be verified before completing onboarding');
  }

  if (this.isExpired) {
    throw new Error('Onboarding token has expired');
  }

  this.onBoarded = true;
  this.onBoardedAt = new Date();
  this.status = 'COMPLETED';

  if (checklistData) {
    this.checklistCompleted = { ...this.checklistCompleted, ...checklistData };
  }

  return this.save();
};

OnboardEmployeeMongooseSchema.methods.cancel =
  async function cancel(): Promise<IOnboardEmployeeDocument> {
    this.status = 'CANCELLED';
    return this.save();
  };

OnboardEmployeeMongooseSchema.methods.extendExpiry = async function extendExpiry(
  additionalDays: number = 7
): Promise<IOnboardEmployeeDocument> {
  const newExpiryDate = new Date(this.expiresAt);
  newExpiryDate.setDate(newExpiryDate.getDate() + additionalDays);

  this.expiresAt = newExpiryDate;

  if (this.status === 'EXPIRED') {
    this.status = 'PENDING';
  }

  return this.save();
};

OnboardEmployeeMongooseSchema.methods.sendReminder =
  async function sendReminder(): Promise<IOnboardEmployeeDocument> {
    if (!this.sendReminders) {
      throw new Error('Reminders are disabled for this onboarding');
    }

    if (this.remindersSent >= this.maxReminders) {
      throw new Error('Maximum number of reminders already sent');
    }

    this.remindersSent += 1;
    this.lastReminderSent = new Date();

    return this.save();
  };

OnboardEmployeeMongooseSchema.methods.updateChecklist = async function updateChecklist(
  checklistItem: string,
  completed: boolean
): Promise<IOnboardEmployeeDocument> {
  if (!this.checklistCompleted) {
    this.checklistCompleted = {};
  }

  this.checklistCompleted[checklistItem] = completed;
  this.markModified('checklistCompleted');

  return this.save();
};

OnboardEmployeeMongooseSchema.methods.canSendReminder = function canSendReminder(): boolean {
  return (
    this.sendReminders &&
    this.remindersSent < this.maxReminders &&
    !this.onBoarded &&
    !this.isExpired &&
    this.status !== 'CANCELLED'
  );
};

OnboardEmployeeMongooseSchema.methods.getDisplayInfo = function getDisplayInfo() {
  return {
    status: this.status,
    verified: this.verified,
    onBoarded: this.onBoarded,
    expirationStatus: this.expirationStatus,
    daysUntilExpiration: this.daysUntilExpiration,
    completionPercentage: this.completionPercentage,
    remindersSent: this.remindersSent,
    canSendReminder: this.canSendReminder(),
  };
};

// Static Methods
OnboardEmployeeMongooseSchema.statics.findWithPagination = async function findWithPagination(
  filter: IOnboardEmployeeFilter
): Promise<IOnboardEmployeePaginationResult> {
  const {
    search,
    organizationId,
    status,
    verified,
    onBoarded,
    createdById,
    dateRange,
    startDateRange,
    expirationStatus,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filter;

  // Build query
  const query: FilterQuery<IOnboardEmployeeBase> = {};

  if (search) {
    query.$or = [
      { employeeId: { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
    ];
  }

  if (organizationId) query.organization = organizationId;
  if (status) query.status = status;
  if (typeof verified === 'boolean') query.verified = verified;
  if (typeof onBoarded === 'boolean') query.onBoarded = onBoarded;
  if (createdById) query.createdBy = createdById;

  if (dateRange) {
    const dateFilter: FilterQuery<IOnboardEmployeeBase> = {};
    if (dateRange.from) dateFilter.$gte = dateRange.from;
    if (dateRange.to) dateFilter.$lte = dateRange.to;
    if (Object.keys(dateFilter).length > 0) query.createdAt = dateFilter;
  }

  if (startDateRange) {
    const startDateFilter: FilterQuery<IOnboardEmployeeBase> = {};
    if (startDateRange.from) startDateFilter.$gte = startDateRange.from;
    if (startDateRange.to) startDateFilter.$lte = startDateRange.to;
    if (Object.keys(startDateFilter).length > 0) query.startDate = startDateFilter;
  }

  if (expirationStatus) {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    switch (expirationStatus) {
      case 'EXPIRED':
        query.expiresAt = { $lt: now };
        break;
      case 'EXPIRING_SOON':
        query.expiresAt = { $gte: now, $lt: oneDayFromNow };
        break;
      case 'ACTIVE':
        query.expiresAt = { $gte: oneDayFromNow };
        break;
      default:
        break;
    }
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Build sort object
  const sort: Record<string, 1 | -1> = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute queries with population
  const [onboardings, total] = await Promise.all([
    this.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('organization', 'name')
      .populate('createdBy', 'firstName lastName email')
      .exec(),
    this.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    onboardings,
    total,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

OnboardEmployeeMongooseSchema.statics.findByToken = async function findByToken(token: string) {
  const doc = await this.findOne({ token }).populate('organization', 'name type id').exec();
  return doc;
};

OnboardEmployeeMongooseSchema.statics.findByUser = async function findByUser(
  userId: string,
  organizationId?: string
) {
  const query: FilterQuery<IOnboardEmployeeBase> = { createdBy: userId };
  if (organizationId) query.organization = organizationId;

  return this.find(query)
    .populate('organization', 'name')
    .populate('assignedRole', 'name key')
    .sort({ createdAt: -1 })
    .exec();
};

OnboardEmployeeMongooseSchema.statics.findExpired = async function findExpired() {
  const now = new Date();
  return this.find({
    expiresAt: { $lt: now },
    status: { $nin: ['COMPLETED', 'CANCELLED', 'EXPIRED'] },
  }).exec();
};

OnboardEmployeeMongooseSchema.statics.findExpiringSoon = async function findExpiringSoon(
  hours: number = 24
) {
  const now = new Date();
  const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

  return this.find({
    expiresAt: { $gte: now, $lt: futureTime },
    status: { $nin: ['COMPLETED', 'CANCELLED', 'EXPIRED'] },
    verified: false,
  }).exec();
};

OnboardEmployeeMongooseSchema.statics.findPendingReminders = async function findPendingReminders() {
  return this.find({
    sendReminders: true,
    onBoarded: false,
    verified: false,
    status: { $nin: ['COMPLETED', 'CANCELLED', 'EXPIRED'] },
    expiresAt: { $gt: new Date() },
    $expr: { $lt: ['$remindersSent', '$maxReminders'] },
  }).exec();
};

OnboardEmployeeMongooseSchema.statics.createOnboarding = async function createOnboarding(
  data: Partial<IOnboardEmployeeBase>
): Promise<IOnboardEmployeeDocument> {
  const onboardingData: Partial<IOnboardEmployeeBase> = {
    ...data,
    token: data.token || generateOnboardingToken(),
    expiresAt: data.expiresAt || calculateExpirationDate(7),
    checklistCompleted: data.checklistCompleted || DEFAULT_ONBOARDING_CHECKLIST,
    status: 'PENDING',
    verified: false,
    onBoarded: false,
    remindersSent: 0,
  };
  const created = await this.create(onboardingData);
  return created as IOnboardEmployeeDocument;
};

OnboardEmployeeMongooseSchema.statics.bulkUpdateStatus = async function bulkUpdateStatus(
  onboardingIds: string[],
  status: OnboardEmployeeStatus
) {
  return this.updateMany(
    { _id: { $in: onboardingIds } },
    {
      status,
      ...(status === 'EXPIRED' && { updatedAt: new Date() }),
    }
  );
};

OnboardEmployeeMongooseSchema.statics.bulkExtendExpiry = async function bulkExtendExpiry(
  onboardingIds: string[],
  additionalDays: number = 7
) {
  const operations = onboardingIds.map(id => ({
    updateOne: {
      filter: { _id: id },
      update: [
        {
          $set: {
            expiresAt: {
              $dateAdd: {
                startDate: '$expiresAt',
                unit: 'day',
                amount: additionalDays,
              },
            },
            status: {
              $cond: {
                if: { $eq: ['$status', 'EXPIRED'] },
                then: 'PENDING',
                else: '$status',
              },
            },
            updatedAt: new Date(),
          },
        },
      ],
    },
  }));

  return this.bulkWrite(operations);
};

OnboardEmployeeMongooseSchema.statics.getStatistics = async function getStatistics(
  organizationId?: string
) {
  const matchStage = organizationId
    ? { organization: new mongoose.Types.ObjectId(organizationId) }
    : {};

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
        expired: { $sum: { $cond: [{ $eq: ['$status', 'EXPIRED'] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] } },
        verified: { $sum: { $cond: ['$verified', 1, 0] } },
        onBoarded: { $sum: { $cond: ['$onBoarded', 1, 0] } },
        avgCompletionTime: {
          $avg: {
            $cond: [
              { $and: ['$verifiedAt', '$onBoardedAt'] },
              { $subtract: ['$onBoardedAt', '$verifiedAt'] },
              null,
            ],
          },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      expired: 0,
      cancelled: 0,
      verified: 0,
      onBoarded: 0,
      avgCompletionTime: null,
    }
  );
};

// Pre-save middleware to handle status transitions
OnboardEmployeeMongooseSchema.pre('save', async function save(next) {
  // Auto-expire if past expiration date
  if (
    this.expiresAt < new Date() &&
    this.status !== 'EXPIRED' &&
    this.status !== 'COMPLETED' &&
    this.status !== 'CANCELLED'
  ) {
    this.status = 'EXPIRED';
  }

  // Ensure onBoardedAt is set when completing
  if (this.isModified('onBoarded') && this.onBoarded && !this.onBoardedAt) {
    this.onBoardedAt = new Date();
  }

  // Ensure verifiedAt is set when verifying
  if (this.isModified('verified') && this.verified && !this.verifiedAt) {
    this.verifiedAt = new Date();
  }

  // Update status based on completion
  if (this.isModified('onBoarded') && this.onBoarded && this.status !== 'COMPLETED') {
    this.status = 'COMPLETED';
  }

  next();
});

// Pre-save middleware to validate token uniqueness
OnboardEmployeeMongooseSchema.pre('save', async function save(next) {
  if (this.isModified('token')) {
    const Model = this.constructor as IOnboardEmployeeModel;
    const exists = await Model.countDocuments({
      token: this.token,
      _id: { $ne: this._id },
    });

    if (exists > 0) {
      const error = new Error('Onboarding token must be unique');
      error.name = 'ValidationError';
      return next(error);
    }
  }

  return next();
});

export const OnboardEmployeeModel =
  (mongoose.models.OnboardEmployee as unknown as IOnboardEmployeeModel) ||
  mongoose.model<IOnboardEmployeeSchema>('OnboardEmployee', OnboardEmployeeMongooseSchema);
