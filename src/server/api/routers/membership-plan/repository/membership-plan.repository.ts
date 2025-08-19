import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger/logger';

import { MembershipPlanModel } from '../model/membership-plan.model';
import {
  type CreateMembershipPlanParams,
  type GetMembershipPlanParams,
  type ListMembershipPlansParams,
  type UpdateMembershipPlanParams,
} from './membership-plan.repository.types';

class MembershipPlanRepository {
  private readonly logger = new Logger(MembershipPlanRepository.name);

  list = async ({ orgId }: ListMembershipPlansParams) => {
    const filter: Record<string, string> = {
      organization: orgId,
    };
    return MembershipPlanModel.list(filter);
  };

  get = async ({ id }: GetMembershipPlanParams) => {
    return MembershipPlanModel.get(id);
  };

  findByOrganizationId = async (orgId: string) => {
    return MembershipPlanModel.list({ organization: orgId });
  };

  create = async ({ data, orgId }: CreateMembershipPlanParams) => {
    try {
      const doc = new MembershipPlanModel({
        ...data,
        organization: orgId,
      });
      await doc.save();
      return doc.toObject();
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
      return updatedMembershipPlan.toObject();
    } catch (error) {
      this.logger.error('Failed to update membershipPlan', error);
      throw error;
    }
  };

  delete = async ({ id }: GetMembershipPlanParams) => {
    try {
      await MembershipPlanModel.findByIdAndDelete(id);
      return { id };
    } catch (error) {
      this.logger.error('Failed to delete membershipPlan', error);
      throw error;
    }
  };
}

export const membershipPlanRepository = new MembershipPlanRepository();
