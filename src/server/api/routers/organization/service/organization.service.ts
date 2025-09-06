import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger';

import { organizationRepository } from '../repository/organization.repository';
import type {
  CreateOrganizationArgs,
  GetOrganizationByIdArgs,
  ListOrganizationsArgs,
  UpdateOrganizationArgs,
} from './organization.service.types';

class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  getUserCacheById = async ({ id }: GetOrganizationByIdArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Organization ID is required',
        });
      }
      const organization = await organizationRepository.getUserCacheById(id);
      return organization;
    } catch (error: unknown) {
      this.logger.error('Failed to get organization by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get organization by id',
      });
    }
  };

  create = async ({ input }: CreateOrganizationArgs) => {
    try {
      const organization = await organizationRepository.create({ data: input });
      return organization;
    } catch (error: unknown) {
      this.logger.error('Failed to create organization', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create organization',
      });
    }
  };

  update = async ({ input }: UpdateOrganizationArgs) => {
    const { id, data } = input;
    try {
      const organization = await organizationRepository.update({ id, data });
      return organization;
    } catch (error: unknown) {
      this.logger.error('Failed to update organization', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update organization',
      });
    }
  };

  list = async ({ userId }: ListOrganizationsArgs) => {
    try {
      const organizations = await organizationRepository.list({ userId });
      return organizations;
    } catch (error: unknown) {
      this.logger.error('Failed to list organizations', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list organizations',
      });
    }
  };
}

export const organizationService = new OrganizationService();
