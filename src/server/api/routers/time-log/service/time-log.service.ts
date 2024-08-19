import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger';

import { timeLogRepository } from '../repository/time-log.repository';
import type {
  CreateTimeLogArgs,
  GetTimeLogByIdArgs,
  ListTimeLogsArgs,
  UpdateTimeLogArgs,
} from './time-log.service.types';

class TimeLogService {
  private readonly logger = new Logger(TimeLogService.name);

  getById = async ({ id }: GetTimeLogByIdArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'TimeLog ID is required',
        });
      }
      const timeLog = await timeLogRepository.getById(id);
      return timeLog;
    } catch (error: unknown) {
      this.logger.error('Failed to get timeLog by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get timeLog by id',
      });
    }
  };

  create = async ({ input, orgId }: CreateTimeLogArgs) => {
    try {
      const timeLog = await timeLogRepository.create({ data: input, orgId });
      return timeLog;
    } catch (error: unknown) {
      this.logger.error('Failed to create timeLog', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create timeLog',
      });
    }
  };

  update = async ({ input }: UpdateTimeLogArgs) => {
    const { id, data } = input;
    try {
      const timeLog = await timeLogRepository.update({ id, data });
      return timeLog;
    } catch (error: unknown) {
      this.logger.error('Failed to update timeLog', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update timeLog',
      });
    }
  };

  list = async ({ orgId, clientId }: ListTimeLogsArgs) => {
    try {
      const timeLogs = await timeLogRepository.list({ orgId, clientId });
      return timeLogs;
    } catch (error: unknown) {
      this.logger.error('Failed to list timeLogs', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list timeLogs',
      });
    }
  };
}

export const timeLogService = new TimeLogService();
