import type { CreateCheckInInputSchema, UpdateCheckInInputSchema } from '../check-in.input';
import type { ICheckInSchema } from '../model/check-in.model';

export type CreateCheckInParams = {
  orgId: string;
  data: CreateCheckInInputSchema;
};

export type UpdateCheckInParams = {
  id: ICheckInSchema['id'];
  data: UpdateCheckInInputSchema['data'];
};

export type ListCheckInsParams = {
  orgId: string;
  clientId?: string;
};

export type GenerateTokenCheckInParams = {
  orgId: string;
};

export type GetByOrgIdParams = {
  orgId: string;
};
