import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger/logger';

import { type IMembershipPlanSchema, MembershipPlanModel } from '../model/membership-plan.model';
import {
  type CreateMembershipPlanParams,
  type ListMembershipPlansParams,
  type UpdateMembershipPlanParams,
} from './membership-plan.repository.types';

class MembershipPlanRepository {
  private readonly logger = new Logger(MembershipPlanRepository.name);

  getById = async (id: IMembershipPlanSchema['id']) => {
    return MembershipPlanModel.get(id);
  };

  create = async ({ data, orgId }: CreateMembershipPlanParams) => {
    try {
      const doc = new MembershipPlanModel({
        ...data,
        organization: orgId,
      });
      await doc.save();
      return doc;
    } catch (error) {
      this.logger.error('Failed to create membershipPlan', error);
      throw error;
    }
  };

  update = async ({ id, data }: UpdateMembershipPlanParams) => {
    try {
      const updatedMembershipPlan = await MembershipPlanModel.findByIdAndUpdate(id, data, {
        new: true,
      }).exec();
      if (!updatedMembershipPlan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'MembershipPlan not found with the given ID',
        });
      }
      return updatedMembershipPlan;
    } catch (error) {
      this.logger.error('Failed to update membershipPlan', error);
      throw error;
    }
  };

  list = async ({ orgId }: ListMembershipPlansParams) => {
    const filter: Record<string, string> = {
      organization: orgId,
    };
    return MembershipPlanModel.list(filter);
  };
}

export const membershipPlanRepository = new MembershipPlanRepository();
