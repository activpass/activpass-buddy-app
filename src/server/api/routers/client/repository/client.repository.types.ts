import type { CreateClientInputSchema, UpdateClientInputSchema } from '../client.input';
import type { IClientSchema } from '../model/client.model';

export type CreateClientParams = {
  orgId: string;
  data: CreateClientInputSchema;
};

export type UpdateClientParams = {
  id: IClientSchema['id'];
  data: UpdateClientInputSchema['data'];
};

export type ListClientParams = {
  orgId: string;
};

export type AnalyticsClientParams = {
  orgId: string;
};
