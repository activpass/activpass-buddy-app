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
