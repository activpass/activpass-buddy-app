import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger';

import { checkinTokenRepository } from '../repository/checkin-token.repository';
import type {
  CreateCheckinTokenArgs,
  GetCheckinTokenByIdArgs,
  ListCheckinTokensArgs,
  UpdateCheckinTokenArgs,
} from './checkin-token.service.types';

class CheckinTokenService {
  private readonly logger = new Logger(CheckinTokenService.name);

  getById = async ({ id }: GetCheckinTokenByIdArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'CheckinToken ID is required',
        });
      }
      const checkinToken = await checkinTokenRepository.getById(id);
      return checkinToken;
    } catch (error: unknown) {
      this.logger.error('Failed to get checkinToken by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get checkinToken by id',
      });
    }
  };

  create = async ({ input, orgId }: CreateCheckinTokenArgs) => {
    try {
      const checkinToken = await checkinTokenRepository.create({ data: input, orgId });
      return checkinToken;
    } catch (error: unknown) {
      this.logger.error('Failed to create checkinToken', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create checkinToken',
      });
    }
  };

  update = async ({ input }: UpdateCheckinTokenArgs) => {
    const { id, data } = input;
    try {
      const checkinToken = await checkinTokenRepository.update({ id, data });
      return checkinToken;
    } catch (error: unknown) {
      this.logger.error('Failed to update checkinToken', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update checkinToken',
      });
    }
  };

  list = async ({ orgId, clientId }: ListCheckinTokensArgs) => {
    try {
      const checkinTokens = await checkinTokenRepository.list({ orgId, clientId });
      return checkinTokens;
    } catch (error: unknown) {
      this.logger.error('Failed to list checkinTokens', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list checkinTokens',
      });
    }
  };
}

export const checkinTokenService = new CheckinTokenService();
