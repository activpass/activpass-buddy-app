import { TRPCError } from '@trpc/server';

import { clientRepository } from '@/server/api/routers/client/repository/client.repository';
import { deleteFileFromImageKit } from '@/server/api/utils/imagekit';
import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger';

import type { IIncomeSchema } from '../../income/model/income.model';
import { incomeRepository } from '../../income/repository/income.repository';
import {
  type IMembershipPlanSchema,
  MembershipPlanModel,
} from '../../membership-plan/model/membership-plan.model';
import { organizationService } from '../../organization/service/organization.service';
import { updateMembershipPlan } from '../helper/client.helper';
import { createClientIncome } from '../helper/createClientIncome.helper';
import { ClientModel, type IClientSchema } from '../model/client.model';
import { onboardClientRepository } from '../repository/onboard-client.repository';
import type {
  AnalyticsClientsArgs,
  CreateClientArgs,
  CurrentMembershipPlanArgs,
  DeleteAvatarArgs,
  GenerateOnboardingLinkArgs,
  GetClientByIdArgs,
  ListClientsArgs,
  RenewMembershipPlanArgs,
  SubmitOnboardingClientArgs,
  UpdateAvatarArgs,
  UpdateClientArgs,
  UpgradeMembershipPlanArgs,
  VerifyOnboardingTokenArgs,
} from './client.service.types';

class ClientService {
  private readonly logger = new Logger(ClientService.name);

  getUserCacheById = async ({ id }: GetClientByIdArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Client ID is required',
        });
      }
      const client = await (await clientRepository.getUserCacheById(id)).populate('membershipPlan');

      return client.toObject({
        flattenObjectIds: true,
      }) as Omit<IClientSchema, 'membershipPlan'> & {
        membershipPlan: IMembershipPlanSchema | null;
      };
    } catch (error: unknown) {
      this.logger.error('Failed to get client by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get client by id',
      });
    }
  };

  getPopulatedById = async ({ id }: GetClientByIdArgs) => {
    try {
      const client = await clientRepository.getPopulatedById(id);
      return client;
    } catch (error) {
      this.logger.error('Failed to get client by id', error);
      throw getTRPCError(error);
    }
  };

  create = async ({ input, orgId }: CreateClientArgs) => {
    try {
      const { paymentDetail, membershipDetail } = input;

      const planDoc = await MembershipPlanModel.findById(membershipDetail.planId);

      if (!planDoc) {
        throw new Error('Membership plan not found');
      }

      const incomeDoc = await createClientIncome({
        plan: planDoc,
        orgId,
        paymentDetail,
        docSave: false,
      });

      const client = await clientRepository.create({ data: input, orgId, incomeId: incomeDoc.id });

      incomeDoc.client = client.id;
      await incomeDoc.save();

      return client;
    } catch (error) {
      throw getTRPCError(error);
    }
  };

  update = async ({ input }: UpdateClientArgs) => {
    const { id, data } = input;
    try {
      const { personalInformation, ...restData } = data;
      const inputData = { ...personalInformation, ...restData };
      const client = await clientRepository.update(id, inputData);
      return client;
    } catch (error: unknown) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update client',
      });
    }
  };

  list = async ({ orgId }: ListClientsArgs) => {
    try {
      // find a status of client with membership plan from income
      // const clients = await ClientModel.aggregate<{
      //   _id: mongoose.Types.ObjectId;
      //   avatar: IClientSchema['avatar'];
      //   firstName: IClientSchema['firstName'];
      //   lastName: IClientSchema['lastName'];
      //   phoneNumber: IClientSchema['phoneNumber'];
      //   membershipPlan: IMembershipPlanSchema;
      //   income: IIncomeSchema;
      //   organization: mongoose.Types.ObjectId;
      // }>([
      //   {
      //     $match: {
      //       organization: generateMongooseObjectId(orgId),
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'incomes',
      //       localField: '_id',
      //       foreignField: 'client',
      //       as: 'income',
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: '$income',
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 1,
      //       firstName: 1,
      //       lastName: 1,
      //       avatar: 1,
      //       phoneNumber: 1,
      //       membershipPlan: 1,
      //       income: 1,
      //       organization: 1,
      //     },
      //   },
      // ]);
      // await MembershipPlanModel.populate(clients, { path: 'membershipPlan' });
      // // TODO: TEMP solution, We need to find a better way to remove duplicate clients
      // const removeDuplicateClients = clients.filter((client, index, self) => {
      //   return index === self.findIndex(t => t._id.toHexString() === client._id.toHexString());
      // });

      const clients = await clientRepository.list({ orgId });
      const populatedClients = await ClientModel.populate<{
        membershipPlan: { name: string };
        income: { paymentStatus: IIncomeSchema['paymentStatus'] };
      }>(clients, [
        {
          path: 'membershipPlan',
          select: 'name',
        },
        {
          path: 'income',
          select: 'paymentStatus',
        },
      ]);

      return populatedClients.map(client => {
        return {
          id: client._id.toHexString(),
          firstName: client.firstName,
          lastName: client.lastName,
          avatar: client.avatar?.url || '',
          name: `${client.firstName} ${client.lastName}`.trim(),
          phoneNumber: client.phoneNumber,
          email: client.email,
          checkInDate: client.checkInDate,
          joiningDate: client.createdAt,
          membershipPlanName: client.membershipPlan?.name || '',
          status: client.income?.paymentStatus || '',
          orgId: client.organization._id.toHexString(),
        };
      });
    } catch (error) {
      throw getTRPCError(error);
    }
  };

  analytics = async ({ orgId }: AnalyticsClientsArgs) => {
    try {
      const clientRecord = await clientRepository.analytics({ orgId });
      return clientRecord;
    } catch (error: unknown) {
      this.logger.error('Failed to calculate client analytics', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to calculate client analytics',
      });
    }
  };

  generateOnboardingLink = ({ orgId, userId }: GenerateOnboardingLinkArgs) => {
    return onboardClientRepository.generateOnboardingLink({ orgId, userId });
  };

  verifyOnboardingToken = ({ token }: VerifyOnboardingTokenArgs) => {
    return onboardClientRepository.verifyOnboardingToken({ token });
  };

  submitOnboardingClient = async ({ input }: SubmitOnboardingClientArgs) => {
    const { onboardClientId, ...restInput } = input;
    const onboardClient = await onboardClientRepository.getUserCacheById(onboardClientId);

    const organization = await organizationService.getUserCacheById({
      id: onboardClient.organization.toHexString(),
    });

    if (onboardClient.onBoarded) {
      throw new Error('Client already onboarded');
    }

    await this.create({
      orgId: organization.id,
      input: restInput,
    });

    onboardClient.onBoarded = true;
    onboardClient.onBoardedAt = new Date();
    await onboardClient.save();

    return {
      message: 'Client onboarded successfully',
      data: {
        id: onboardClient.id,
      },
    };
  };

  updateAvatar = async ({ input }: UpdateAvatarArgs) => {
    return clientRepository.updateAvatar(input);
  };

  deleteAvatar = async ({ input }: DeleteAvatarArgs) => {
    const doc = await clientRepository.deleteAvatar(input);
    const fileId = doc.avatar?.fileId;
    if (fileId) {
      // delete file from imagekit
      await deleteFileFromImageKit(fileId);
    }
    return {
      data: {
        id: doc.id,
      },
      message: 'Avatar deleted successfully',
    };
  };

  upgradeMembershipPlan = async ({ input }: UpgradeMembershipPlanArgs) => {
    return updateMembershipPlan({
      clientId: input.clientId,
      membershipPlanId: input.membershipPlanId,
      isUpgrade: true,
    });
  };

  renewMembershipPlan = async ({ input }: RenewMembershipPlanArgs) => {
    return updateMembershipPlan({
      clientId: input.clientId,
      membershipPlanId: input.membershipPlanId,
      isUpgrade: false,
    });
  };

  getCurrentMembershipPlan = async ({ clientId }: CurrentMembershipPlanArgs) => {
    const client = await clientRepository.getUserCacheById(clientId);
    const plan = await incomeRepository.getCurrentMembershipPlanIncome({
      clientId: client.id,
      orgId: client.organization.toHexString(),
      membershipPlanId: client.membershipPlan.toHexString(),
    });

    const populatedPlan = await plan.populate('membershipPlan');

    return populatedPlan.toObject<
      IIncomeSchema & { membershipPlan: IMembershipPlanSchema; client: string }
    >({
      flattenObjectIds: true,
    });
  };
}

export const clientService = new ClientService();
