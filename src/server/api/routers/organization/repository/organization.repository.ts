import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger/logger';

import { type IOrganizationSchema, OrganizationModel } from '../model/organization.model';
import {
  type AddUserToOrganizationParams,
  type CreateOrganizationParams,
  type ListOrganizationsParams,
  type UpdateOrganizationParams,
} from './organization.repository.types';

class OrganizationRepository {
  private readonly logger = new Logger(OrganizationRepository.name);

  getById = async (id: IOrganizationSchema['id']) => {
    return OrganizationModel.get(id);
  };

  create = async ({ data }: CreateOrganizationParams) => {
    try {
      const org = new OrganizationModel(data);
      await org.save();
      return org;
    } catch (error) {
      this.logger.error('Failed to create org', error);
      throw error;
    }
  };

  addUserToOrganization = async ({
    orgId,
    userId,
    isUpdateCreatedById,
  }: AddUserToOrganizationParams) => {
    try {
      const data: Record<string, unknown> = { $push: { users: userId } };

      if (isUpdateCreatedById) {
        data.$addToSet = { createdBy: userId };
      }
      const updatedOrganization = await OrganizationModel.findByIdAndUpdate(orgId, data, {
        new: true,
      }).exec();

      if (!updatedOrganization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        });
      }
      return updatedOrganization;
    } catch (error) {
      this.logger.error('Failed to add user to organization', error);
      throw error;
    }
  };

  update = async ({ id, data }: UpdateOrganizationParams) => {
    try {
      const updatedOrganization = await OrganizationModel.findByIdAndUpdate(id, data, {
        new: true,
      }).exec();
      if (!updatedOrganization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        });
      }
      return updatedOrganization;
    } catch (error) {
      this.logger.error('Failed to update organization', error);
      throw error;
    }
  };

  list = async ({ userId }: ListOrganizationsParams) => {
    return OrganizationModel.list({
      createdBy: userId,
    });
  };
}

export const organizationRepository = new OrganizationRepository();
