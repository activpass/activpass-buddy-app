import type {
  CreateIncomeInputSchema,
  GetByIdInputSchema,
  UpdateIncomeInputSchema,
} from '../income.input';

export type GetIncomeByIdArgs = {
  input: GetByIdInputSchema;
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
