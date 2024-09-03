import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger/logger';

import { CheckinTokenModel, type ICheckinTokenSchema } from '../model/checkin-token.model';
import {
  type CreateCheckinTokenParams,
  type ListCheckinTokensParams,
  type UpdateCheckinTokenParams,
} from './checkin-token.repository.types';

class CheckinTokenRepository {
  private readonly logger = new Logger(CheckinTokenRepository.name);

  getById = async (id: ICheckinTokenSchema['id']) => {
    return CheckinTokenModel.get(id);
  };

  create = async ({ data, orgId }: CreateCheckinTokenParams) => {
    try {
      const doc = new CheckinTokenModel({
        ...data,
        organization: orgId,
      });
      await doc.save();
      return doc;
    } catch (error) {
      this.logger.error('Failed to create checkinToken', error);
      throw error;
    }
  };

  update = async ({ id, data }: UpdateCheckinTokenParams) => {
    try {
      const updatedCheckinToken = await CheckinTokenModel.findByIdAndUpdate(id, data, {
        new: true,
      }).exec();
      if (!updatedCheckinToken) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'CheckinToken not found',
        });
      }
      return updatedCheckinToken;
    } catch (error) {
      this.logger.error('Failed to update checkinToken', error);
      throw error;
    }
  };

  list = async ({ orgId, clientId }: ListCheckinTokensParams) => {
    const filter: Record<string, string> = {
      organization: orgId,
    };
    if (clientId) {
      filter.client = clientId;
    }
    return CheckinTokenModel.list(filter);
  };
}

export const checkinTokenRepository = new CheckinTokenRepository();
