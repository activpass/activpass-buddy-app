/* eslint-disable max-classes-per-file */
import type { HydratedDocument, Model, Types } from 'mongoose';

import type { IOrganizationSchema } from '../../organization/model/organization.model';
import type { IOnboardEmployeeFilter, OnboardEmployeeStatus } from '../onboard-employee.input';

export interface IOnboardEmployeeBase {
  organization: Types.ObjectId;
  employee: Types.ObjectId;
  token: string;
  expiresAt: Date;
  status: OnboardEmployeeStatus;
  verified: boolean;
  onBoarded: boolean;
  onBoardedAt?: Date | null;
  verifiedAt?: Date | null;
  startDate?: Date | null;
  jobTitle?: string | null;
  department?: string | null;
  notes?: string | null;
  checklistCompleted?: Record<string, boolean> | null;
  remindersSent: number;
  lastReminderSent?: Date | null;
  maxReminders: number;
  sendReminders: boolean;
  metadata?: Record<string, unknown> | null;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId | null;
}

export interface IOnboardEmployeeSchema extends IOnboardEmployeeBase {
  id: string;
  isExpired: boolean;
  expirationStatus: 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON';
  daysUntilExpiration: number;
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

// Instance methods interface
export interface IOnboardEmployeeMethods {
  verify(): Promise<IOnboardEmployeeDocument>;
  complete(checklistData?: Record<string, boolean>): Promise<IOnboardEmployeeDocument>;
  cancel(): Promise<IOnboardEmployeeDocument>;
  extendExpiry(additionalDays?: number): Promise<IOnboardEmployeeDocument>;
  sendReminder(): Promise<IOnboardEmployeeDocument>;
  updateChecklist(checklistItem: string, completed: boolean): Promise<IOnboardEmployeeDocument>;
  canSendReminder(): boolean;
  getDisplayInfo(): {
    status: OnboardEmployeeStatus;
    verified: boolean;
    onBoarded: boolean;
    expirationStatus: 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON';
    daysUntilExpiration: number;
    completionPercentage: number;
    remindersSent: number;
    canSendReminder: boolean;
  };
}

// Document interface combining schema and methods
export interface IOnboardEmployeeDocument
  extends HydratedDocument<IOnboardEmployeeSchema, IOnboardEmployeeMethods> {}

// Pagination result interface
export interface IOnboardEmployeePaginationResult {
  onboardings: IOnboardEmployeeDocument[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Statistics interface
export interface IOnboardEmployeeStatistics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  expired: number;
  cancelled: number;
  verified: number;
  onBoarded: number;
  avgCompletionTime: number | null;
}

// Bulk operation parameters
export interface IBulkOperationParameters {
  additionalDays?: number;
  customMessage?: string;
  force?: boolean;
}

export type PopulatedOrganization = Pick<IOrganizationSchema, '_id' | 'name' | 'type' | 'id'>;

export type PopulatedOnboardEmployeeDocument = Omit<IOnboardEmployeeDocument, 'organization'> & {
  organization: PopulatedOrganization;
};

// Static methods interface
export interface IOnboardEmployeeStaticMethods {
  findWithPagination(filter: IOnboardEmployeeFilter): Promise<IOnboardEmployeePaginationResult>;
  findByToken(token: string): Promise<PopulatedOnboardEmployeeDocument | null>;
  findByUser(userId: string, organizationId?: string): Promise<IOnboardEmployeeDocument[]>;
  findExpired(): Promise<IOnboardEmployeeDocument[]>;
  findExpiringSoon(hours?: number): Promise<IOnboardEmployeeDocument[]>;
  findPendingReminders(): Promise<IOnboardEmployeeDocument[]>;
  createOnboarding(data: Partial<IOnboardEmployeeBase>): Promise<IOnboardEmployeeDocument>;
  bulkUpdateStatus(onboardingIds: string[], status: OnboardEmployeeStatus): Promise<unknown>;
  bulkExtendExpiry(onboardingIds: string[], additionalDays?: number): Promise<unknown>;
  getStatistics(organizationId?: string): Promise<IOnboardEmployeeStatistics>;
}

// Model interface combining static methods with base Model
export interface IOnboardEmployeeModel
  extends Model<IOnboardEmployeeSchema, {}, IOnboardEmployeeMethods>,
    IOnboardEmployeeStaticMethods {}

// Population interfaces for populated fields
export interface IPopulatedOrganization {
  _id: Types.ObjectId;
  name: string;
}

export interface IPopulatedUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IPopulatedRole {
  _id: Types.ObjectId;
  name: string;
  key: string;
}

export interface IOnboardEmployeeDocumentPopulated
  extends Omit<
    IOnboardEmployeeDocument,
    'organization' | 'user' | 'assignedRole' | 'manager' | 'createdBy'
  > {
  organization: IPopulatedOrganization;
  user: IPopulatedUser;
  assignedRole?: IPopulatedRole;
  manager?: IPopulatedUser;
  createdBy: IPopulatedUser;
}

// API response interfaces
export interface IOnboardEmployeeCreateResponse {
  onboarding: IOnboardEmployeeDocument;
  message: string;
}

export interface IOnboardEmployeeVerifyResponse {
  onboarding: IOnboardEmployeeDocument;
  message: string;
}

export interface IOnboardEmployeeCompleteResponse {
  onboarding: IOnboardEmployeeDocument;
  message: string;
}

// Email template data interface
export interface IOnboardEmployeeEmailData {
  employeeName: string;
  organizationName: string;
  invitationUrl: string;
  expiresAt: Date;
  jobTitle?: string;
  department?: string;
  startDate?: Date;
  managerName?: string;
}

// Reminder email data interface
export interface IOnboardEmployeeReminderEmailData extends IOnboardEmployeeEmailData {
  reminderNumber: number;
  daysUntilExpiry: number;
  customMessage?: string;
}

// Notification event interfaces
export interface IOnboardEmployeeEventData {
  onboardingId: string;
  organizationId: string;
  userId: string;
  status: OnboardEmployeeStatus;
  timestamp: Date;
}

export interface IOnboardEmployeeCreatedEvent extends IOnboardEmployeeEventData {
  type: 'ONBOARDING_CREATED';
  invitationSent: boolean;
}

export interface IOnboardEmployeeVerifiedEvent extends IOnboardEmployeeEventData {
  type: 'ONBOARDING_VERIFIED';
}

export interface IOnboardEmployeeCompletedEvent extends IOnboardEmployeeEventData {
  type: 'ONBOARDING_COMPLETED';
  completionPercentage: number;
}

export interface IOnboardEmployeeExpiredEvent extends IOnboardEmployeeEventData {
  type: 'ONBOARDING_EXPIRED';
}

export interface IOnboardEmployeeReminderSentEvent extends IOnboardEmployeeEventData {
  type: 'ONBOARDING_REMINDER_SENT';
  reminderNumber: number;
}

export type OnboardEmployeeEvent =
  | IOnboardEmployeeCreatedEvent
  | IOnboardEmployeeVerifiedEvent
  | IOnboardEmployeeCompletedEvent
  | IOnboardEmployeeExpiredEvent
  | IOnboardEmployeeReminderSentEvent;

// Error interfaces
export interface IOnboardEmployeeError {
  code: string;
  message: string;
  details?: unknown;
}

export class OnboardEmployeeValidationError extends Error {
  public code: string;

  public details: unknown;

  constructor(message: string, code: string = 'VALIDATION_ERROR', details?: unknown) {
    super(message);
    this.name = 'OnboardEmployeeValidationError';
    this.code = code;
    this.details = details;
  }
}

export class OnboardEmployeeNotFoundError extends Error {
  public code: string;

  constructor(identifier: string) {
    super(`Onboard employee not found: ${identifier}`);
    this.name = 'OnboardEmployeeNotFoundError';
    this.code = 'NOT_FOUND';
  }
}

export class OnboardEmployeeExpiredError extends Error {
  public code: string;

  constructor() {
    super('Onboarding token has expired');
    this.name = 'OnboardEmployeeExpiredError';
    this.code = 'TOKEN_EXPIRED';
  }
}

export class OnboardEmployeeAlreadyCompletedError extends Error {
  public code: string;

  constructor() {
    super('Employee onboarding has already been completed');
    this.name = 'OnboardEmployeeAlreadyCompletedError';
    this.code = 'ALREADY_COMPLETED';
  }
}
