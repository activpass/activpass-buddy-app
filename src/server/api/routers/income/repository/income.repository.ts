import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger/logger';

import type { IMembershipPlanSchema } from '../../membership-plan/model/membership-plan.model';
import { type IIncomeDocument, type IIncomeSchema, IncomeModel } from '../model/income.model';
import {
  type CreateIncomeParams,
  type ListIncomesParams,
  type UpdateIncomeParams,
} from './income.repository.types';

class IncomeRepository {
  private readonly logger = new Logger(IncomeRepository.name);

  getById = async (id: IIncomeSchema['id']) => {
    return IncomeModel.get(id);
  };

  create = async ({
    data,
    orgId,
    clientId,
    membershipPlanId,
    docSave = true,
  }: CreateIncomeParams) => {
    try {
      const doc = new IncomeModel({
        ...data,
        organization: orgId,
        client: data.client || clientId || null,
        membershipPlan: data.membershipPlan || membershipPlanId || null,
      });
      if (docSave) {
        await doc.save();
      }
      return doc;
    } catch (error) {
      this.logger.error('Failed to create income', error);
      throw error;
    }
  };

  update = async ({ id, data }: UpdateIncomeParams) => {
    try {
      const updatedIncome = await IncomeModel.findByIdAndUpdate(id, data, {
        new: true,
      }).exec();
      if (!updatedIncome) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Income not found',
        });
      }
      return updatedIncome;
    } catch (error) {
      this.logger.error('Failed to update income', error);
      throw error;
    }
  };

  list = async ({ orgId, clientId }: ListIncomesParams) => {
    const filter: Record<string, string> = {
      organization: orgId,
    };
    if (clientId) {
      filter.client = clientId;
    }
    return IncomeModel.list<
      Omit<IIncomeDocument, 'membershipPlan'> & { membershipPlan: IMembershipPlanSchema | null }
    >(filter, ['membershipPlan']);
  };
}

export const incomeRepository = new IncomeRepository();
