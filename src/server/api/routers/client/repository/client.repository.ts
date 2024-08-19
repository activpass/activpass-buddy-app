import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import { generateRandomToken } from '@/server/api/helpers/common';
import {
  type AnalyticsClientParams,
  type CreateClientParams,
  type ListClientParams,
  type UpdateClientParams,
} from '@/server/api/routers/client/repository/client.repository.types';
import { Logger } from '@/server/logger/logger';

import { TimeLogModel } from '../../time-log/model/time-log.model';
import { ClientModel, type IClientSchema, type IClientVirtuals } from '../model/client.model';

class ClientRepository {
  private readonly logger = new Logger(ClientRepository.name);

  getById = async (id: IClientSchema['id']) => {
    return ClientModel.get(id);
  };

  getByEmail = async (email: IClientSchema['email']) => {
    return ClientModel.findByEmail(email);
  };

  isClientExists = async (email: string) => {
    try {
      const client = await ClientModel.findOne({
        email,
      }).exec();

      if (client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Client with email "${client.email}" already exist.`,
        });
      }
    } catch (error) {
      this.logger.error('Failed to check if client exists', error);
      throw error;
    }
  };

  create = async ({ data, orgId }: CreateClientParams) => {
    try {
      await this.isClientExists(data.email);

      const dataBody: Omit<IClientSchema, keyof IClientVirtuals> = {
        ...data,
        uniqueId: generateRandomToken(),
        organization: new mongoose.Types.ObjectId(orgId),
        isDeleted: false,
        membership: null,
        income: null,
      };

      const client = new ClientModel(dataBody);
      await client.save();
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
      totalClients: 0,
      currentMonthTotalClients: 0,
      currentDatePresentCount: 0,
      currentDateAbsentCount: 0,
    };

    try {
      const totalClients = await ClientModel.aggregate([
        {
          $match: {
            organization: new mongoose.Types.ObjectId(orgId),
          },
        },
        {
          $count: 'totalClients',
        },
      ]).exec();

      if (totalClients.length > 0) {
        result.totalClients = totalClients[0].totalClients;
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
          $count: 'currentMonthTotalClients',
        },
      ]).exec();

      if (currentMonthTotalClients.length > 0) {
        result.currentMonthTotalClients = currentMonthTotalClients[0].totalCurrentMonthClients;
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
          $count: 'currentDatePresentCount',
        },
      ]).exec();

      if (currentDatePresentCount.length > 0) {
        result.currentDatePresentCount = currentDatePresentCount[0].currentDatePresentCount;
      }

      const currentDateAbsentCount = result.totalClients - result.currentDatePresentCount;
      result.currentDateAbsentCount = currentDateAbsentCount;

      return result;
    } catch (error) {
      this.logger.error('Failed to get client analytics', error);
      throw error;
    }
  };
}

export const clientRepository = new ClientRepository();
