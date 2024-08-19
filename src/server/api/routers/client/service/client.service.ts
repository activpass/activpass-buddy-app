import { TRPCError } from '@trpc/server';

import { clientRepository } from '@/server/api/routers/client/repository/client.repository';
import { Logger } from '@/server/logger';

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

  create = async ({ input, orgId }: CreateClientArgs) => {
    try {
      const client = await clientRepository.create({ data: input, orgId });
      return client;
    } catch (error: unknown) {
      this.logger.error('Failed to create client', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create client',
      });
    }
  };

  update = async ({ input }: UpdateClientArgs) => {
    const { id, data } = input;
    try {
      const client = await clientRepository.update({ id, data });
      return client;
    } catch (error: unknown) {
      this.logger.error('Failed to update client', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update client',
      });
    }
  };

  list = async ({ orgId }: ListClientsArgs) => {
    try {
      const clients = await clientRepository.list({ orgId });
      return clients;
    } catch (error: unknown) {
      this.logger.error('Failed to list clients', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list clients',
      });
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
