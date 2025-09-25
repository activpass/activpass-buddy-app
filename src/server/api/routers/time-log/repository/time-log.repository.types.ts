import type { ITimeLogSchema } from '../model/time-log.model';
import type { CreateTimeLogInputSchema, UpdateTimeLogInputSchema } from '../time-log.input';

export type CreateTimeLogParams = {
  orgId: string;
  data: CreateTimeLogInputSchema;
};

export type UpdateTimeLogParams = {
  id: ITimeLogSchema['id'];
  data: UpdateTimeLogInputSchema['data'];
};

export type ListTimeLogsParams = {
  orgId: string;
  clientId?: string;
  employeeId?: string;
};

export type UpdateCheckInTimeLogParams = {
  orgId: string;
  data: Pick<CreateTimeLogInputSchema, 'clientId' | 'checkIn' | 'employeeId'>;
};

export type UpdateCheckOutTimeLogParams = {
  orgId: string;
  clientId?: string;
  employeeId?: string;
  data: Pick<CreateTimeLogInputSchema, 'checkOut'>;
};

export type GetTimeLogWithDateRangeParams = {
  orgId: string;
  startDate: Date;
  endDate: Date;
  clientId?: string;
  employeeId?: string;
};
