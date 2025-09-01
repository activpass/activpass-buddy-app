import type {
  ClientCheckInInputSchema,
  ClientCheckInVerifyInputSchema,
  ClientCheckOutInputSchema,
  ClientCheckOutVerifyInputSchema,
  CreateTimeLogInputSchema,
  GetTimeLogByClientIdWithDateRangeInputSchema,
  UpdateTimeLogInputSchema,
} from '../time-log.input';

export type GetTimeLogByIdArgs = {
  id: string;
};

export type CreateTimeLogArgs = {
  orgId: string;
  input: CreateTimeLogInputSchema;
};

export type UpdateTimeLogArgs = {
  input: UpdateTimeLogInputSchema;
};

export type ListTimeLogsArgs = {
  orgId: string;
  clientId?: string;
};

export type GetByClientIdWithDateRangeArgs = {
  orgId: string;
  input: GetTimeLogByClientIdWithDateRangeInputSchema;
};

export type ClientCheckInArgs = {
  input: ClientCheckInInputSchema;
};

export type ClientCheckInVerifyArgs = {
  input: ClientCheckInVerifyInputSchema;
};

export type ClientCheckOutArgs = {
  input: ClientCheckOutInputSchema;
};

export type ClientCheckOutVerifyArgs = {
  input: ClientCheckOutVerifyInputSchema;
};
