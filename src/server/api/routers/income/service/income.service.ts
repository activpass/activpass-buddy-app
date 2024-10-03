import { TRPCError } from '@trpc/server';

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

  getById = async ({ id }: GetIncomeByIdArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Income ID is required',
        });
      }
      const income = await incomeRepository.getById(id);
      return income;
    } catch (error: unknown) {
      this.logger.error('Failed to get income by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get income by id',
      });
    }
  };

  getPopulatedById = async ({ id }: GetIncomeByIdArgs) => {
    try {
      const income = await incomeRepository.getPopulatedById(id);
      return income;
    } catch (error: unknown) {
      this.logger.error('Failed to get income by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get income by id',
      });
    }
  };

  create = async ({ input, orgId }: CreateIncomeArgs) => {
    try {
      const income = await incomeRepository.create({ data: input, orgId });
      return income;
    } catch (error: unknown) {
      this.logger.error('Failed to create income', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create income',
      });
    }
  };

  update = async ({ input }: UpdateIncomeArgs) => {
    const { id, data } = input;
    try {
      const income = await incomeRepository.update({ id, data });
      return income;
    } catch (error: unknown) {
      this.logger.error('Failed to update income', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update income',
      });
    }
  };

  list = async ({ orgId, clientId }: ListIncomesArgs) => {
    try {
      const incomes = await incomeRepository.list({ orgId, clientId });
      return incomes.map(income => {
        return income.toObject({
          flattenObjectIds: true,
        });
      });
    } catch (error: unknown) {
      this.logger.error('Failed to list incomes', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list incomes',
      });
    }
  };
}

export const incomeService = new IncomeService();
