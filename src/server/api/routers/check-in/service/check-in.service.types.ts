import type { CreateCheckInInputSchema, UpdateCheckInInputSchema } from '../check-in.input';

export type GetCheckInByIdArgs = {
  id: string;
};

export type CreateCheckInArgs = {
  orgId: string;
  input: CreateCheckInInputSchema;
};

export type UpdateCheckInArgs = {
  input: UpdateCheckInInputSchema;
};

export type ListCheckInsArgs = {
  orgId: string;
  clientId?: string;
};

export type GenerateTokenCheckInArgs = {
  orgId: string;
};
