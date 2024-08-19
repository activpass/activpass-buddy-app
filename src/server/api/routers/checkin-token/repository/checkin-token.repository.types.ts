import type {
  CreateCheckinTokenInputSchema,
  UpdateCheckinTokenInputSchema,
} from '../checkin-token.input';
import type { ICheckinTokenSchema } from '../model/checkin-token.model';

export type CreateCheckinTokenParams = {
  orgId: string;
  data: CreateCheckinTokenInputSchema;
};

export type UpdateCheckinTokenParams = {
  id: ICheckinTokenSchema['id'];
  data: UpdateCheckinTokenInputSchema['data'];
};

export type ListCheckinTokensParams = {
  orgId: string;
  clientId?: string;
};
