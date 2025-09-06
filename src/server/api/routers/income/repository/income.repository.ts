import { TRPCError } from '@trpc/server';
import { startOfDay } from 'date-fns';

import { Logger } from '@/server/logger/logger';
import { getDueDate } from '@/utils/helpers';

import type { IClientSchema } from '../../client/model/client.model';
import type { IMembershipPlanSchema } from '../../membership-plan/model/membership-plan.model';
import type { IOrganizationSchema } from '../../organization/model/organization.model';
import { type IIncomeDocument, type IIncomeSchema, IncomeModel } from '../model/income.model';
import {
  type CreateIncomeParams,
  type GetCurrentMembershipPlanIncomeParams,
  type ListIncomesParams,
  type UpdateIncomeParams,
} from './income.repository.types';

class IncomeRepository {
  private readonly logger = new Logger(IncomeRepository.name);

  getUserCacheById = async (id: IIncomeSchema['id']) => {
    return IncomeModel.get(id);
  };

  getPopulatedById = async (id: IIncomeSchema['id']) => {
    const result = await IncomeModel.getPopulated<
      Omit<IIncomeSchema, 'membershipPlan' | 'client' | 'organization'> & {
        membershipPlan: IMembershipPlanSchema | null;
        client: IClientSchema | null;
        organization: IOrganizationSchema | null;
      }
    >(id, ['organization', 'membershipPlan', 'client']);
    return result;
  };

  create = async ({
    data,
    orgId,
    clientId,
    membershipPlanId,
    docSave = true,
  }: CreateIncomeParams) => {
    try {
      const { tenure } = data;

      const date = startOfDay(new Date());
      const dueDate = getDueDate(tenure, date);

      const newData = { ...data, dueDate: dueDate.toISOString(), date: date.toISOString() };

      const doc = new IncomeModel({
        ...newData,
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

  getCurrentMembershipPlanIncome = async ({
    orgId,
    clientId,
    membershipPlanId,
  }: GetCurrentMembershipPlanIncomeParams) => {
    const doc = await IncomeModel.findOne({
      organization: orgId,
      client: clientId,
      membershipPlan: membershipPlanId,
    })
      .sort('-createdAt')
      .exec();
    if (!doc) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Income not found',
      });
    }
    return doc;
  };
}

export const incomeRepository = new IncomeRepository();
