import { TRPCError } from '@trpc/server';
import { addDays, isAfter } from 'date-fns';

import { generateRandomToken } from '@/server/api/helpers/common';
import { Logger } from '@/server/logger/logger';

import { membershipPlanRepository } from '../../membership-plan/repository/membership-plan.repository';
import type { IOrganizationSchema } from '../../organization/model/organization.model';
import { type IClientSchema } from '../model/client.model';
import { type IOnboardClientDocument, OnboardClientModel } from '../model/onboard-client.model';
import type {
  CreateOnboardClientParams,
  GenerateOnboardingLinkParams,
  ListOnboardClientParams,
  UpdateOnboardClientParams,
  VerifyOnboardingTokenParams,
} from './onboard-client.repository.types.';

class OnboardClientRepository {
  private readonly logger = new Logger(OnboardClientRepository.name);

  getUserCacheById = async (id: IClientSchema['id']) => {
    return OnboardClientModel.get(id);
  };

  create = async ({ userId, orgId, docSave = true }: CreateOnboardClientParams) => {
    const body = {
      organization: orgId,
      user: userId,
      token: generateRandomToken(),
      expiresAt: addDays(new Date(), 1),
    };
    const doc = new OnboardClientModel(body);
    if (docSave) {
      await doc.save();
    }
    return doc;
  };

  update = async ({ id, data }: UpdateOnboardClientParams) => {
    try {
      const updatedDoc = await OnboardClientModel.findByIdAndUpdate(id, data, {
        new: true,
      }).exec();
      if (!updatedDoc) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Onboard Client not found',
        });
      }
      return updatedDoc;
    } catch (error) {
      this.logger.error('Failed to update onboard client', error);
      throw error;
    }
  };

  list = async ({ orgId }: ListOnboardClientParams) => {
    return OnboardClientModel.list({
      organization: orgId,
    });
  };

  getByToken = async (token: string) => {
    const onboardClient = await OnboardClientModel.findOne<
      IOnboardClientDocument & {
        organization: IOrganizationSchema;
      }
    >({ token }).populate('organization');

    if (!onboardClient) {
      throw new Error('Invalid verification token');
    }
    return onboardClient;
  };

  generateOnboardingLink = async ({ orgId, userId }: GenerateOnboardingLinkParams) => {
    try {
      const doc = await this.create({ orgId, userId });
      return doc;
    } catch (error) {
      this.logger.error('Failed to generate onboarding external link', error);
      throw error;
    }
  };

  verifyOnboardingToken = async ({ token }: VerifyOnboardingTokenParams) => {
    try {
      if (!token) {
        throw new Error('Verification token is required');
      }

      const onboardClient = await this.getByToken(token);

      if (onboardClient.onBoarded) {
        throw new Error('Client already onBoarded');
      }

      if (isAfter(new Date(), onboardClient.expiresAt)) {
        throw new Error('Verification token expired, please request a new one');
      }

      const membershipPlans = await membershipPlanRepository.findByOrganizationId(
        onboardClient.organization.id
      );

      if (!onboardClient.verified) {
        onboardClient.verified = true;
        await onboardClient.save();
      }

      return {
        onBoardingId: onboardClient.id,
        verified: onboardClient.verified,
        membershipPlans: membershipPlans.map(plan =>
          plan.toObject({
            flattenObjectIds: true,
          })
        ),
        organization: {
          name: onboardClient.organization.name,
          id: onboardClient.organization.id,
          type: onboardClient.organization.type,
        },
      };
    } catch (error) {
      this.logger.error('Error verifying OnboardClient:', error);
      throw error;
    }
  };
}

export const onboardClientRepository = new OnboardClientRepository();
