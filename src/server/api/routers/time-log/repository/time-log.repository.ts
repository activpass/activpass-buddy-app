import { TRPCError } from '@trpc/server';

import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger/logger';

import { type ITimeLogSchema, TimeLogModel } from '../model/time-log.model';
import {
  type CreateTimeLogParams,
  type ListTimeLogsParams,
  type UpdateCheckInTimeLogParams,
  type UpdateCheckOutTimeLogParams,
  type UpdateTimeLogParams,
} from './time-log.repository.types';

class TimeLogRepository {
  private readonly logger = new Logger(TimeLogRepository.name);

  getById = async (id: ITimeLogSchema['id']) => {
    return TimeLogModel.get(id);
  };

  create = async ({ data, orgId }: CreateTimeLogParams) => {
    try {
      const { clientId, ...restData } = data;
      const doc = new TimeLogModel({
        ...restData,
        organization: orgId,
        client: clientId || null,
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

  updateCheckIn = async ({ data, orgId }: UpdateCheckInTimeLogParams) => {
    try {
      const timeLog = await TimeLogModel.findOne({
        client: data.clientId,
        organization: orgId,
        checkIn: {
          $gte: new Date(data.checkIn).setHours(0, 0, 0, 0),
          $lte: new Date(data.checkIn).setHours(23, 59, 59, 999),
        },
      }).exec();
      if (timeLog) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You have already checked in',
        });
      }
      return await this.create({ data, orgId });
    } catch (error) {
      this.logger.error('Failed to find and create timeLog', error);
      throw error;
    }
  };

  updateCheckOut = async ({ data, clientId, orgId }: UpdateCheckOutTimeLogParams) => {
    try {
      const timeLog = await TimeLogModel.findOne({
        client: clientId,
        organization: orgId,
        checkIn: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lte: new Date().setHours(23, 59, 59, 999),
        },
      }).exec();
      if (!timeLog) {
        throw getTRPCError('You have not checked in, please check in first', 'BAD_REQUEST');
      }
      return await this.update({ id: timeLog.id, data });
    } catch (error) {
      this.logger.error('Failed to find and update timeLog', error);
      throw error;
    }
  };
}

export const timeLogRepository = new TimeLogRepository();
