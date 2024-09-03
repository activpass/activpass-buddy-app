import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger';

import { membershipPlanRepository } from '../repository/membership-plan.repository';
import type {
  CreateMembershipPlanArgs,
  DeleteMembershipPlanArgs,
  GetMembershipPlanArgs,
  ListMembershipPlanArgs,
  UpdateMembershipPlanArgs,
} from './membership-plan.service.types';

class MembershipPlanService {
  private readonly logger = new Logger(MembershipPlanService.name);

  get = async ({ input: { id } }: GetMembershipPlanArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'MembershipPlan ID is required',
        });
      }
      const membershipPlan = await membershipPlanRepository.get({ id });
      return membershipPlan;
    } catch (error: unknown) {
      this.logger.error('Failed to get membershipPlan by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get membershipPlan by id',
      });
    }
  };

  create = async ({ input, orgId }: CreateMembershipPlanArgs) => {
    try {
      const membershipPlan = await membershipPlanRepository.create({ data: input, orgId });
      return membershipPlan;
    } catch (error: unknown) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create membershipPlan',
      });
    }
  };

  update = async ({ input }: UpdateMembershipPlanArgs) => {
    const { id, data } = input;
    try {
      const membershipPlan = await membershipPlanRepository.update({ id, data });
      return membershipPlan;
    } catch (error: unknown) {
      this.logger.error('Failed to update membershipPlan', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update membershipPlan',
      });
    }
  };

  list = async ({ orgId }: ListMembershipPlanArgs) => {
    try {
      const membershipPlans = await membershipPlanRepository.list({ orgId });
      return membershipPlans.map(membershipPlan => {
        return membershipPlan.toObject({
          flattenObjectIds: true,
        });
      });
    } catch (error: unknown) {
      this.logger.error('Failed to list membershipPlans', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list membershipPlans',
      });
    }
  };

  delete = async ({ input: { id } }: DeleteMembershipPlanArgs) => {
    const membershipPlan = await membershipPlanRepository.delete({ id });
    return membershipPlan;
  };
}

export const membershipPlanService = new MembershipPlanService();
