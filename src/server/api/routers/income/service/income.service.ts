import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger';

import { incomeRepository } from '../repository/income.repository';
import type {
  CreateIncomeArgs,
  GetIncomeByIdArgs,
  ListIncomesArgs,
  UpdateIncomeArgs,
} from './income.service.types';

class IncomeService {
  private readonly logger = new Logger(IncomeService.name);

  getById = async ({ input }: GetIncomeByIdArgs) => {
    try {
      const income = await incomeRepository.getById(input.id);
      return income;
    } catch (error: unknown) {
      this.logger.error('Failed to get income by id', error);
      throw getTRPCError('Failed to get income by id');
    }
  };

  getPopulatedById = async ({ input }: GetIncomeByIdArgs) => {
    try {
      const income = await incomeRepository.getPopulatedById(input.id);
      return income;
    } catch (error: unknown) {
      this.logger.error('Failed to get income by id', error);
      throw getTRPCError('Failed to get populated income by id');
    }
  };

  create = async ({ input, orgId }: CreateIncomeArgs) => {
    try {
      const income = await incomeRepository.create({ data: input, orgId });
      return income;
    } catch (error: unknown) {
      this.logger.error('Failed to create income', error);
      throw getTRPCError('Failed to create income');
    }
  };

  update = async ({ input }: UpdateIncomeArgs) => {
    const { id, data } = input;
    try {
      const income = await incomeRepository.update({ id, data });
      return income;
    } catch (error: unknown) {
      this.logger.error('Failed to update income', error);
      throw getTRPCError('Failed to update income');
    }
  };

  list = async ({ orgId, clientId }: ListIncomesArgs) => {
    try {
      const incomes = await incomeRepository.list({ orgId, clientId });
      const items = incomes.map(income => {
        return income.toObject({
          flattenObjectIds: true,
        }) as typeof income;
      });
      return items;
    } catch (error: unknown) {
      this.logger.error('Failed to list incomes', error);
      throw getTRPCError('Failed to list incomes');
    }
  };
}

export const incomeService = new IncomeService();
