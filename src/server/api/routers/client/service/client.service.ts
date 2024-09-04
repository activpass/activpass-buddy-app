import { TRPCError } from '@trpc/server';
import type mongoose from 'mongoose';

import { generateMongooseObjectId } from '@/server/api/helpers/common';
import { clientRepository } from '@/server/api/routers/client/repository/client.repository';
import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger';

import type { IIncomeSchema } from '../../income/model/income.model';
import { incomeRepository } from '../../income/repository/income.repository';
import {
  type IMembershipPlanSchema,
  MembershipPlanModel,
} from '../../membership-plan/model/membership-plan.model';
import { ClientModel, type IClientSchema } from '../model/client.model';
import type {
  AnalyticsClientsArgs,
  CreateClientArgs,
  GetClientByIdArgs,
  ListClientsArgs,
  UpdateClientArgs,
} from './client.service.types';

class ClientService {
  private readonly logger = new Logger(ClientService.name);

  getById = async ({ id }: GetClientByIdArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Client ID is required',
        });
      }
      const client = await clientRepository.getById(id);
      return client;
    } catch (error: unknown) {
      this.logger.error('Failed to get client by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get client by id',
      });
    }
  };

  getPopulatedById = async ({ id }: GetClientByIdArgs) => {
    try {
      const client = await clientRepository.getPopulatedById(id);
      return client;
    } catch (error) {
      this.logger.error('Failed to get client by id', error);
      throw getTRPCError(error);
    }
  };

  create = async ({ input, orgId }: CreateClientArgs) => {
    try {
      const { paymentDetail, membershipDetail } = input;

      const incomeDoc = await incomeRepository.create({
        orgId,
        membershipPlanId: membershipDetail.planId,
        data: {
          ...paymentDetail,
          tenure: membershipDetail.tenure,
          invoiceId: generateMongooseObjectId().toHexString(),
        },
        docSave: false,
      });

      const client = await clientRepository.create({ data: input, orgId });

      incomeDoc.client = client.id;
      await incomeDoc.save();

      return client;
    } catch (error) {
      throw getTRPCError(error);
    }
  };

  update = async ({ input }: UpdateClientArgs) => {
    const { id, data } = input;
    try {
      const client = await clientRepository.update({ id, data });
      return client;
    } catch (error: unknown) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update client',
      });
    }
  };

  list = async ({ orgId }: ListClientsArgs) => {
    try {
      // find a status of client with membership plan from income
      const clients = await ClientModel.aggregate<{
        _id: mongoose.Types.ObjectId;
        avatar: IClientSchema['avatar'];
        firstName: IClientSchema['firstName'];
        lastName: IClientSchema['lastName'];
        phoneNumber: IClientSchema['phoneNumber'];
        membershipPlan: IMembershipPlanSchema;
        income: IIncomeSchema;
        organization: mongoose.Types.ObjectId;
      }>([
        {
          $match: {
            organization: generateMongooseObjectId(orgId),
          },
        },
        {
          $lookup: {
            from: 'incomes',
            localField: '_id',
            foreignField: 'client',
            as: 'income',
          },
        },
        {
          $unwind: {
            path: '$income',
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1,
            phoneNumber: 1,
            membershipPlan: 1,
            income: 1,
            organization: 1,
          },
        },
      ]);
      await MembershipPlanModel.populate(clients, { path: 'membershipPlan' });
      return clients.map(client => {
        return {
          id: client._id.toHexString(),
          firstName: client.firstName,
          lastName: client.lastName,
          avatar: client.avatar,
          name: `${client.firstName} ${client.lastName}`.trim(),
          phoneNumber: client.phoneNumber,
          membershipPlanName: client.membershipPlan?.name || 'N/A',
          status: client.income.paymentStatus,
          orgId: client.organization.toHexString(),
        };
      });
    } catch (error) {
      throw getTRPCError(error);
    }
  };

  analytics = async ({ orgId }: AnalyticsClientsArgs) => {
    try {
      const clientRecord = await clientRepository.analytics({ orgId });
      return clientRecord;
    } catch (error: unknown) {
      this.logger.error('Failed to calculate client analytics', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to calculate client analytics',
      });
    }
  };
}

export const clientService = new ClientService();
