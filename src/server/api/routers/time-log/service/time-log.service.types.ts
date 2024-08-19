import type { CreateTimeLogInputSchema, UpdateTimeLogInputSchema } from '../time-log.input';

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
