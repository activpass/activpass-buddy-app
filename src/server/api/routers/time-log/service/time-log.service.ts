import { dateIntl } from '@paalan/react-shared/lib';
import { TRPCError } from '@trpc/server';
import { differenceInMinutes } from 'date-fns';

import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger';

import { checkInRepository } from '../../check-in/repository/check-in.repository';
import { clientRepository } from '../../client/repository/client.repository';
import { timeLogRepository } from '../repository/time-log.repository';
import type {
  ClientCheckInArgs,
  ClientCheckInVerifyArgs,
  ClientCheckOutArgs,
  ClientCheckOutVerifyArgs,
  CreateTimeLogArgs,
  GetByClientIdWithDateRangeArgs,
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
    } catch (error) {
      this.logger.error('Failed to get timeLog by id', error);
      throw getTRPCError(error);
    }
  };

  create = async ({ input, orgId }: CreateTimeLogArgs) => {
    try {
      const timeLog = await timeLogRepository.create({ data: input, orgId });
      return timeLog;
    } catch (error) {
      this.logger.error('Failed to create timeLog', error);
      throw getTRPCError(error);
    }
  };

  update = async ({ input }: UpdateTimeLogArgs) => {
    const { id, data } = input;
    try {
      const timeLog = await timeLogRepository.update({ id, data });
      return timeLog;
    } catch (error) {
      this.logger.error('Failed to update timeLog', error);
      throw getTRPCError(error);
    }
  };

  list = async ({ orgId, clientId }: ListTimeLogsArgs) => {
    try {
      const timeLogs = await timeLogRepository.list({ orgId, clientId });
      return timeLogs.map(timeLog => {
        return timeLog.toObject({
          flattenObjectIds: true,
        });
      });
    } catch (error) {
      this.logger.error('Failed to list timeLogs', error);
      throw getTRPCError(error);
    }
  };

  getByClientIdWithDateRange = async ({ orgId, input }: GetByClientIdWithDateRangeArgs) => {
    try {
      const timeLogs = await timeLogRepository.getTimeLogWithDateRange({ orgId, ...input });
      return timeLogs.reduce((acc: Record<string, { duration: number }>, timeLog) => {
        const date = dateIntl.format(timeLog.checkIn, { dateFormat: 'yyyy-MM-dd' });
        acc[date] = {
          duration: timeLog.checkOut
            ? differenceInMinutes(timeLog.checkOut, timeLog.checkIn, {
                roundingMethod: 'ceil',
              })
            : 0,
        };
        return acc;
      }, {});
    } catch (error) {
      this.logger.error('Failed to get calendar timeLogs by clientId', error);
      throw getTRPCError(error);
    }
  };

  clientCheckIn = async ({ input }: ClientCheckInArgs) => {
    const { phoneNumber, orgId } = input;
    const clientDoc = await clientRepository.findByPhoneNumber(orgId, phoneNumber);

    return {
      name: clientDoc.fullName,
      phoneNumber: clientDoc.phoneNumber,
      email: clientDoc.email,
      dob: clientDoc.dob,
      orgId: clientDoc.organization.toHexString(),
    };
  };

  clientCheckInVerify = async ({ input }: ClientCheckInVerifyArgs) => {
    const { phoneNumber, orgId, pin } = input;
    const clientDoc = await clientRepository.findByPhoneNumber(orgId, phoneNumber);

    const checkInDoc = await checkInRepository.getByOrgId({
      orgId,
    });

    if (checkInDoc.pin !== pin) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid pin',
      });
    }

    const dateNow = new Date();

    await timeLogRepository.updateCheckIn({
      orgId,
      data: {
        clientId: clientDoc.id,
        checkIn: dateNow,
      },
    });

    await clientRepository.update(clientDoc.id, {
      checkInDate: dateNow,
      checkOutDate: undefined,
    });

    return {
      success: true,
    };
  };

  clientCheckOut = async ({ input }: ClientCheckOutArgs) => {
    return this.clientCheckIn({ input });
  };

  clientCheckOutVerify = async ({ input }: ClientCheckOutVerifyArgs) => {
    const { phoneNumber, orgId, pin } = input;
    const clientDoc = await clientRepository.findByPhoneNumber(orgId, phoneNumber);

    const checkInDoc = await checkInRepository.getByOrgId({
      orgId,
    });

    if (checkInDoc.pin !== pin) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid pin',
      });
    }

    const dateNow = new Date();
    await timeLogRepository.updateCheckOut({
      orgId,
      clientId: clientDoc.id,
      data: {
        checkOut: dateNow,
      },
    });

    await clientRepository.update(clientDoc.id, {
      checkOutDate: dateNow,
    });

    return {
      success: true,
    };
  };
}

export const timeLogService = new TimeLogService();
