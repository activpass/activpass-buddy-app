import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger';

import { membershipPlanRepository } from '../repository/membership-plan.repository';
import type {
  CreateMembershipPlanArgs,
  GetMembershipPlanByIdArgs,
  ListMembershipPlansArgs,
  UpdateMembershipPlanArgs,
} from './membership-plan.service.types';

class MembershipPlanService {
  private readonly logger = new Logger(MembershipPlanService.name);

  getById = async ({ id }: GetMembershipPlanByIdArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'MembershipPlan ID is required',
        });
      }
      const membershipPlan = await membershipPlanRepository.getById(id);
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
      this.logger.error('Failed to create membershipPlan', error);
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

  list = async ({ orgId }: ListMembershipPlansArgs) => {
    try {
      const membershipPlans = await membershipPlanRepository.list({ orgId });
      return membershipPlans;
    } catch (error: unknown) {
      this.logger.error('Failed to list membershipPlans', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list membershipPlans',
      });
    }
  };
}

export const membershipPlanService = new MembershipPlanService();
