import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import { generateClientCode, generateMongooseObjectId } from '@/server/api/helpers/common';
import {
  type AnalyticsClientParams,
  type CreateClientParams,
  type DeleteAvatarParams,
  type ListClientParams,
  type UpdateAvatarParams,
} from '@/server/api/routers/client/repository/client.repository.types';
import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger/logger';

import { TimeLogModel } from '../../time-log/model/time-log.model';
import { ClientModel, type IClientSchema, type IClientVirtuals } from '../model/client.model';

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
          message: `Client with phoneNumber "${phoneNumber}" or email "${email}" already exist.`,
        });
      }
    } catch (error) {
      this.logger.error('Failed to check if client exists', error);
      throw error;
    }
  };

  create = async ({ data, orgId, incomeId, docSave = true }: CreateClientParams) => {
    try {
      const { personalInformation, ...rest } = data;

      await this.isClientExists(personalInformation.email, personalInformation.phoneNumber);

      const goalsAndPreference: IClientSchema['goalsAndPreference'] = {
        ...rest.goalsAndPreference,
        additionalServices: rest.goalsAndPreference.additionalServices || [],
      };
      const dataBody: Omit<IClientSchema, keyof IClientVirtuals> = {
        ...personalInformation,
        emergencyContact: rest.emergencyContact,
        healthAndFitness: rest.healthAndFitness,
        goalsAndPreference,
        consentAndAgreement: rest.consentAndAgreement,
        clientCode: generateClientCode(),
        organization: generateMongooseObjectId(orgId),
        membershipPlan: generateMongooseObjectId(rest.membershipDetail.planId),
        income: generateMongooseObjectId(incomeId),
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

  update = async (id: string, data: Partial<IClientSchema>) => {
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

  updateAvatar = async ({ avatar, clientId }: UpdateAvatarParams) => {
    try {
      const updatedClient = await ClientModel.findByIdAndUpdate(
        clientId,
        {
          avatar,
        },
        { new: true }
      ).exec();
      if (!updatedClient) {
        throw getTRPCError('Client not found', 'NOT_FOUND');
      }
      return updatedClient;
    } catch (error) {
      this.logger.error('Failed to update client avatar', error);
      throw error;
    }
  };

  deleteAvatar = async ({ clientId }: DeleteAvatarParams) => {
    try {
      const updatedClient = await ClientModel.findByIdAndUpdate(
        clientId,
        {
          avatar: null,
        },
        { new: false }
      ).exec();
      if (!updatedClient) {
        throw getTRPCError('Client not found', 'NOT_FOUND');
      }
      return updatedClient;
    } catch (error) {
      this.logger.error('Failed to delete client avatar', error);
      throw error;
    }
  };
}

export const clientRepository = new ClientRepository();
