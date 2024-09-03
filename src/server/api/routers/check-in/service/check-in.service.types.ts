import type {
  ClientCheckInInputSchema,
  ClientCheckInVerifyInputSchema,
  ClientCheckOutInputSchema,
  ClientCheckOutVerifyInputSchema,
  CreateCheckInInputSchema,
  UpdateCheckInInputSchema,
} from '../check-in.input';

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
