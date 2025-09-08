import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger';

import { checkInRepository } from '../repository/check-in.repository';
import type {
  GenerateTokenCheckInArgs,
  GetCheckInByIdArgs,
  ListCheckInsArgs,
  UpdateCheckInArgs,
} from './check-in.service.types';

class CheckInService {
  private readonly logger = new Logger(CheckInService.name);

  getById = async ({ id }: GetCheckInByIdArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'CheckIn ID is required',
        });
      }
      const checkIn = await checkInRepository.getById(id);
      return checkIn;
    } catch (error: unknown) {
      this.logger.error('Failed to get checkIn by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get checkIn by id',
      });
    }
  };

  update = async ({ input }: UpdateCheckInArgs) => {
    const { id, data } = input;
    try {
      const checkIn = await checkInRepository.update({ id, data });
      return checkIn;
    } catch (error: unknown) {
      this.logger.error('Failed to update checkIn', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update checkIn',
      });
    }
  };

  list = async ({ orgId, clientId }: ListCheckInsArgs) => {
    try {
      const checkIns = await checkInRepository.list({ orgId, clientId });
      return checkIns;
    } catch (error: unknown) {
      this.logger.error('Failed to list checkIns', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list checkIns',
      });
    }
  };

  generateToken = async ({ orgId }: GenerateTokenCheckInArgs) => {
    const token = await checkInRepository.generateToken({ orgId });
    return token;
  };
}

export const checkInService = new CheckInService();
