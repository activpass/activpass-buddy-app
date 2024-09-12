import type { CreateClientInputSchema, UpdateClientInputSchema } from '../client.input';

export type GetClientByIdArgs = {
  id: string;
};

export type CreateClientArgs = {
  orgId: string;
  input: CreateClientInputSchema;
};

export type UpdateClientArgs = {
  orgId: string;
  input: UpdateClientInputSchema;
};

export type ListClientsArgs = {
  orgId: string;
};

export type AnalyticsClientsArgs = {
  orgId: string;
};

export type GenerateOnboardingLinkArgs = {
  orgId: string;
  userId: string;
};

export type VerifyOnboardingTokenArgs = {
  token: string;
};
