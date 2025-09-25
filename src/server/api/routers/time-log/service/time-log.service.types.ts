import type {
  CheckInInputSchema,
  CheckInVerifyInputSchema,
  CheckOutInputSchema,
  CheckOutVerifyInputSchema,
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
  employeeId?: string;
};

export type GetTimeLogsByDateRangeArgs = {
  orgId: string;
  input: GetTimeLogByClientIdWithDateRangeInputSchema;
};

export type CheckInArgs = {
  input: CheckInInputSchema;
};

export type CheckInVerifyArgs = {
  input: CheckInVerifyInputSchema;
};

export type CheckOutArgs = {
  input: CheckOutInputSchema;
};

export type CheckOutVerifyArgs = {
  input: CheckOutVerifyInputSchema;
};
