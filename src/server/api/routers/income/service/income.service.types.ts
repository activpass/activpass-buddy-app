import type { CreateIncomeInputSchema, UpdateIncomeInputSchema } from '../income.input';

export type GetIncomeByIdArgs = {
  id: string;
};

export type CreateIncomeArgs = {
  orgId: string;
  input: CreateIncomeInputSchema;
};

export type UpdateIncomeArgs = {
  input: UpdateIncomeInputSchema;
};

export type ListIncomesArgs = {
  orgId: string;
  clientId?: string;
};
