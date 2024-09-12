import { TRPCError } from '@trpc/server';
import { addDays, isAfter } from 'date-fns';
import mongoose from 'mongoose';

import { generateClientCode, generateRandomToken } from '@/server/api/helpers/common';
import {
  type AnalyticsClientParams,
  type CreateClientParams,
  type GenerateOnboardingLinkParams,
  type ListClientParams,
  type UpdateClientParams,
  type VerifyOnboardingTokenParams,
} from '@/server/api/routers/client/repository/client.repository.types';
import { Logger } from '@/server/logger/logger';

import { MembershipPlanModel } from '../../membership-plan/model/membership-plan.model';
import type { IOrganizationSchema } from '../../organization/model/organization.model';
import { TimeLogModel } from '../../time-log/model/time-log.model';
import { ClientModel, type IClientSchema, type IClientVirtuals } from '../model/client.model';
import { type IOnboardClientDocument, OnboardClientModel } from '../model/onboard-client.model';

class ClientRepository {
  private readonly logger = new Logger(ClientRepository.name);

  getById = async (id: IClientSchema['id']) => {
    return ClientModel.get(id);
  };

  getPopulatedById = async (id: IClientSchema['id']) => {
    return ClientModel.getPopulated(id, ['organization', 'membershipPlan']);
  };

  findByEmail = async (email: IClientSchema['email']) => {
    return ClientModel.findByEmail(email);
  };

  findByPhoneNumber = async (phoneNumber: IClientSchema['phoneNumber']) => {
    return ClientModel.findByPhoneNumber(phoneNumber);
  };

  isClientExists = async (email: string, phoneNumber: number) => {
    try {
      const client = await ClientModel.findOne({
        $or: [{ email }, { phoneNumber }],
      }).exec();

      if (client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Client with phoneNumber "${phoneNumber}" already exist.`,
        });
      }
    } catch (error) {
      this.logger.error('Failed to check if client exists', error);
      throw error;
    }
  };

  create = async ({ data, orgId, docSave = true }: CreateClientParams) => {
    try {
      const { clientInformation, ...rest } = data;

      await this.isClientExists(clientInformation.email, clientInformation.phoneNumber);

      const goalsAndPreference: IClientSchema['goalsAndPreference'] = {
        ...rest.goalsAndPreference,
        additionalServices: rest.goalsAndPreference.additionalServices || [],
      };
      const dataBody: Omit<IClientSchema, keyof IClientVirtuals> = {
        ...clientInformation,
        clientCode: generateClientCode(),
        organization: new mongoose.Types.ObjectId(orgId),
        membershipPlan: new mongoose.Types.ObjectId(rest.membershipDetail.planId),
        healthAndFitness: rest.healthAndFitness,
        goalsAndPreference,
        consentAndAgreement: rest.consentAndAgreement,
        isDeleted: false,
      };

      const client = new ClientModel(dataBody);
      if (docSave) {
        await client.save();
      }
      return client;
    } catch (error) {
      this.logger.error('Failed to create client', error);
      throw error;
    }
  };

  update = async ({ id, data }: UpdateClientParams) => {
    try {
      const updatedClient = await ClientModel.findByIdAndUpdate(id, data, { new: true }).exec();
      if (!updatedClient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Client not found',
        });
      }
      return updatedClient;
    } catch (error) {
      this.logger.error('Failed to update client', error);
      throw error;
    }
  };

  list = async ({ orgId }: ListClientParams) => {
    return ClientModel.list({
      organization: orgId,
    });
  };

  analytics = async ({ orgId }: AnalyticsClientParams) => {
    const result = {
      overallCount: 0,
      newAddedCount: 0,
      presentCount: 0,
      absentCount: 0,
    };

    try {
      const totalClients = await ClientModel.aggregate([
        {
          $match: {
            organization: new mongoose.Types.ObjectId(orgId),
          },
        },
        {
          $count: 'overallCount',
        },
      ]).exec();

      if (totalClients.length > 0) {
        result.overallCount = totalClients[0].overallCount;
      }

      const currentMonthTotalClients = await ClientModel.aggregate([
        {
          $match: {
            organization: new mongoose.Types.ObjectId(orgId),
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            },
          },
        },
        {
          $count: 'newAddedCount',
        },
      ]).exec();

      if (currentMonthTotalClients.length > 0) {
        result.newAddedCount = currentMonthTotalClients[0].newAddedCount;
      }

      const currentDatePresentCount = await TimeLogModel.aggregate([
        {
          $match: {
            organization: new mongoose.Types.ObjectId(orgId),
            checkIn: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        },
        {
          $count: 'presentCount',
        },
      ]).exec();

      if (currentDatePresentCount.length > 0) {
        result.presentCount = currentDatePresentCount[0].presentCount;
      }

      const absentCount = result.overallCount - result.presentCount;
      result.absentCount = absentCount;

      return result;
    } catch (error) {
      this.logger.error('Failed to get client analytics', error);
      throw error;
    }
  };

  generateOnboardingLink = async ({ orgId, userId }: GenerateOnboardingLinkParams) => {
    try {
      const body = {
        organization: orgId,
        user: userId,
        token: generateRandomToken(),
        expiresAt: addDays(new Date(), 1),
      };
      const doc = new OnboardClientModel(body);
      await doc.save();
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

      const onboardClient = await OnboardClientModel.findOne<
        IOnboardClientDocument & {
          organization: IOrganizationSchema;
        }
      >({ token }).populate('organization');

      if (!onboardClient) {
        throw new Error('Invalid verification token');
      }

      if (onboardClient.onBoarded) {
        throw new Error('Client already onBoarded');
      }

      if (isAfter(new Date(), onboardClient.expiresAt)) {
        throw new Error('Verification token expired, please request a new one');
      }

      const membershipPlans = await MembershipPlanModel.find({
        organization: onboardClient.organization._id,
      });

      if (!onboardClient.verified) {
        onboardClient.verified = true;
        await onboardClient.save();
      }

      return {
        onBoardingId: onboardClient.id,
        verified: onboardClient.verified,
        membershipPlans,
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

export const clientRepository = new ClientRepository();
