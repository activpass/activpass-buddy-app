import type { CreateIncomeInputSchema, UpdateIncomeInputSchema } from '../income.input';
import type { IIncomeSchema } from '../model/income.model';

export type CreateIncomeParams = {
  orgId: string;
  data: Omit<CreateIncomeInputSchema, 'organization'>;
  clientId?: string;
  membershipPlanId?: string;
  docSave?: boolean;
};

export type UpdateIncomeParams = {
  id: IIncomeSchema['id'];
  data: UpdateIncomeInputSchema['data'];
};

export type ListIncomesParams = {
  orgId: string;
  clientId?: string;
};

export type GetCurrentMembershipPlanIncomeParams = {
  orgId: string;
  clientId: string;
  membershipPlanId: string;
};
