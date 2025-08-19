import type {
  CreateClientInputSchema,
  UpdateAvatarInputSchema,
  UpdateClientInputSchema,
} from '../client.input';
import type { IClientSchema } from '../model/client.model';

export type CreateClientParams = {
  orgId: string;
  incomeId: string;
  data: CreateClientInputSchema;
  docSave?: boolean;
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

export type UpdateAvatarParams = {
  avatar: UpdateAvatarInputSchema['avatar'];
  clientId: string;
};

export type DeleteAvatarParams = {
  clientId: string;
};
