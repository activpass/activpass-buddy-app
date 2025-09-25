import { dateIntl } from '@paalan/react-shared/lib';
import { TRPCError } from '@trpc/server';
import { differenceInMinutes } from 'date-fns';

import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger';
import { type TimeLogTypeEnum, timelogTypeEnum } from '@/validations/check-in/form.validation';

import { checkInRepository } from '../../check-in/repository/check-in.repository';
import { clientRepository } from '../../client/repository/client.repository';
import { employeeRepository } from '../../employees/repository/employee.repository';
import { timeLogRepository } from '../repository/time-log.repository';
import { checkInInputSchema } from '../time-log.input';
import type {
  CheckInArgs,
  CheckInVerifyArgs,
  CheckOutArgs,
  CheckOutVerifyArgs,
  CreateTimeLogArgs,
  GetTimeLogByIdArgs,
  GetTimeLogsByDateRangeArgs,
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

  list = async (args: ListTimeLogsArgs) => {
    try {
      const timeLogs = await timeLogRepository.list(args);
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

  getTimeLogsByDateRange = async ({ orgId, input }: GetTimeLogsByDateRangeArgs) => {
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

  private getByPhoneNumberBasedOnType = async (
    orgId: string,
    phoneNumber: number,
    type: TimeLogTypeEnum
  ) => {
    if (type === checkInInputSchema.shape.type.enum.employee) {
      return (await employeeRepository.findByPhoneNumber(orgId, phoneNumber)).toObject();
    }
    return (await clientRepository.findByPhoneNumber(orgId, phoneNumber)).toObject();
  };

  checkIn = async ({ input }: CheckInArgs) => {
    const { phoneNumber, orgId, type } = input;
    const doc = await this.getByPhoneNumberBasedOnType(orgId, phoneNumber, type);

    return {
      name: doc.fullName,
      phoneNumber: +(doc.phoneNumber || 0),
      email: doc.email,
      dob: doc.dob,
      orgId: doc.orgId,
    };
  };

  checkInVerify = async ({ input }: CheckInVerifyArgs) => {
    const { phoneNumber, orgId, type, pin } = input;
    const doc = await this.getByPhoneNumberBasedOnType(orgId, phoneNumber, type);

    const clientId = type === timelogTypeEnum.enum.client ? doc.id : undefined;
    const employeeId = type === timelogTypeEnum.enum.employee ? doc.id : undefined;

    const checkInDoc = await checkInRepository.getByOrgId({ orgId });

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
        clientId,
        employeeId,
        checkIn: dateNow,
      },
    });

    if (clientId) {
      await clientRepository.update(clientId, {
        checkInDate: dateNow,
        checkOutDate: undefined,
      });
    } else if (employeeId) {
      await employeeRepository.update(
        employeeId,
        {
          checkInDate: dateNow,
          checkOutDate: undefined,
        },
        orgId
      );
    }

    return {
      success: true,
    };
  };

  checkOut = async ({ input }: CheckOutArgs) => {
    return this.checkIn({ input });
  };

  checkOutVerify = async ({ input }: CheckOutVerifyArgs) => {
    const { phoneNumber, orgId, pin, type } = input;
    const doc = await this.getByPhoneNumberBasedOnType(orgId, phoneNumber, type);
    const clientId = type === timelogTypeEnum.enum.client ? doc.id : undefined;
    const employeeId = type === timelogTypeEnum.enum.employee ? doc.id : undefined;

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
      clientId,
      employeeId,
      data: {
        checkOut: dateNow,
      },
    });

    if (clientId) {
      await clientRepository.update(clientId, {
        checkOutDate: dateNow,
      });
    } else if (employeeId) {
      await employeeRepository.update(
        employeeId,
        {
          checkOutDate: dateNow,
        },
        orgId
      );
    }

    return {
      success: true,
    };
  };
}

export const timeLogService = new TimeLogService();
