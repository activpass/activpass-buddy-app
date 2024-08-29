import type {
  CreateCheckinTokenInputSchema,
  UpdateCheckinTokenInputSchema,
} from '../checkin-token.input';

export type GetCheckinTokenByIdArgs = {
  id: string;
};

export type CreateCheckinTokenArgs = {
  orgId: string;
  input: CreateCheckinTokenInputSchema;
};

export type UpdateCheckinTokenArgs = {
  input: UpdateCheckinTokenInputSchema;
};

export type ListCheckinTokensArgs = {
  orgId: string;
  clientId?: string;
};
