import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger/logger';

import { type ITimeLogSchema, TimeLogModel } from '../model/time-log.model';
import {
  type CreateTimeLogParams,
  type ListTimeLogsParams,
  type UpdateTimeLogParams,
} from './time-log.repository.types';

class TimeLogRepository {
  private readonly logger = new Logger(TimeLogRepository.name);

  getById = async (id: ITimeLogSchema['id']) => {
    return TimeLogModel.get(id);
  };

  create = async ({ data, orgId }: CreateTimeLogParams) => {
    try {
      const doc = new TimeLogModel({
        ...data,
        organization: orgId,
      });
      await doc.save();
      return doc;
    } catch (error) {
      this.logger.error('Failed to create timeLog', error);
      throw error;
    }
  };

  update = async ({ id, data }: UpdateTimeLogParams) => {
    try {
      const updatedTimeLog = await TimeLogModel.findByIdAndUpdate(id, data, {
        new: true,
      }).exec();
      if (!updatedTimeLog) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'TimeLog not found',
        });
      }
      return updatedTimeLog;
    } catch (error) {
      this.logger.error('Failed to update timeLog', error);
      throw error;
    }
  };

  list = async ({ orgId, clientId }: ListTimeLogsParams) => {
    const filter: Record<string, string> = {
      organization: orgId,
    };
    if (clientId) {
      filter.client = clientId;
    }
    return TimeLogModel.list(filter);
  };
}

export const timeLogRepository = new TimeLogRepository();
