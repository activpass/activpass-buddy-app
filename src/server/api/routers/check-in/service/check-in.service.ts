import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger';

import { clientRepository } from '../../client/repository/client.repository';
import { timeLogRepository } from '../../time-log/repository/time-log.repository';
import { checkInRepository } from '../repository/check-in.repository';
import type {
  ClientCheckInArgs,
  ClientCheckInVerifyArgs,
  ClientCheckOutArgs,
  ClientCheckOutVerifyArgs,
  CreateCheckInArgs,
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

  create = async ({ input, orgId }: CreateCheckInArgs) => {
    try {
      const checkIn = await checkInRepository.create({ data: input, orgId });
      return checkIn;
    } catch (error: unknown) {
      this.logger.error('Failed to create checkIn', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create checkIn',
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

  clientCheckIn = async ({ input }: ClientCheckInArgs) => {
    const { phoneNumber, orgId } = input;
    const clientDoc = await clientRepository.findByPhoneNumber(phoneNumber);

    if (clientDoc.organization.toString() !== orgId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Client does not belong to this organization',
      });
    }

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
    const clientDoc = await clientRepository.findByPhoneNumber(phoneNumber);

    if (clientDoc.organization.toString() !== orgId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Client does not belong to this organization',
      });
    }

    const checkInDoc = await checkInRepository.getByOrgId({
      orgId,
    });

    if (checkInDoc.pin !== pin) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid pin',
      });
    }

    await timeLogRepository.updateCheckIn({
      orgId,
      data: {
        clientId: clientDoc.id,
        checkIn: new Date(),
      },
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
    const clientDoc = await clientRepository.findByPhoneNumber(phoneNumber);

    if (clientDoc.organization.toString() !== orgId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Client does not belong to this organization',
      });
    }

    const checkInDoc = await checkInRepository.getByOrgId({
      orgId,
    });

    if (checkInDoc.pin !== pin) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid pin',
      });
    }

    await timeLogRepository.updateCheckOut({
      orgId,
      clientId: clientDoc.id,
      data: {
        checkOut: new Date(),
      },
    });

    return {
      success: true,
    };
  };
}

export const checkInService = new CheckInService();
