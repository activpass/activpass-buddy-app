import { TRPCError } from '@trpc/server';
import { randomInt } from 'crypto';

import { Logger } from '@/server/logger/logger';

import { CheckInModel, type ICheckInSchema } from '../model/check-in.model';
import {
  type CreateCheckInParams,
  type GenerateTokenCheckInParams,
  type GetByOrgIdParams,
  type ListCheckInsParams,
  type UpdateCheckInParams,
} from './check-in.repository.types';

class CheckInRepository {
  private readonly logger = new Logger(CheckInRepository.name);

  getById = async (id: ICheckInSchema['id']) => {
    return CheckInModel.get(id);
  };

  create = async ({ data, orgId }: CreateCheckInParams) => {
    try {
      const doc = new CheckInModel({
        ...data,
        organization: orgId,
      });
      await doc.save();
      return doc;
    } catch (error) {
      this.logger.error('Failed to create checkIn', error);
      throw error;
    }
  };

  update = async ({ id, data }: UpdateCheckInParams) => {
    try {
      const updatedCheckIn = await CheckInModel.findByIdAndUpdate(id, data, {
        new: true,
      }).exec();
      if (!updatedCheckIn) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'CheckIn not found',
        });
      }
      return updatedCheckIn;
    } catch (error) {
      this.logger.error('Failed to update checkIn', error);
      throw error;
    }
  };

  list = async ({ orgId, clientId }: ListCheckInsParams) => {
    const filter: Record<string, string> = {
      organization: orgId,
    };
    if (clientId) {
      filter.client = clientId;
    }
    return CheckInModel.list(filter);
  };

  generateToken = async ({ orgId }: GenerateTokenCheckInParams) => {
    try {
      const pin = randomInt(1000, 9999);
      const doc = await CheckInModel.findOneAndUpdate(
        {
          organization: orgId,
        },
        {
          pin,
        },
        {
          new: true,
          upsert: true,
        }
      );
      return doc;
    } catch (error) {
      this.logger.error('Failed to generate checkIn', error);
      throw error;
    }
  };

  getByOrgId = async ({ orgId }: GetByOrgIdParams) => {
    const doc = await CheckInModel.findOne({ organization: orgId });
    if (!doc) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'CheckIn not found',
      });
    }
    return doc;
  };
}

export const checkInRepository = new CheckInRepository();
