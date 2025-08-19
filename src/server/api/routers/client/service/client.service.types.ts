import type { IMembershipPlanSchema } from '../../membership-plan/model/membership-plan.model';
import type {
  CreateClientInputSchema,
  DeleteAvatarInputSchema,
  RenewMembershipPlanInputSchema,
  SubmitOnboardingClientInputSchema,
  UpdateAvatarInputSchema,
  UpdateClientInputSchema,
  UpgradeMembershipPlanInputSchema,
} from '../client.input';

export type GetClientByIdArgs = {
  id: string;
};

export type CreateClientArgs = {
  orgId: string;
  input: CreateClientInputSchema;
};

export type UpdateClientArgs = {
  orgId: string;
  input: UpdateClientInputSchema;
};

export type ListClientsArgs = {
  orgId: string;
};

export type AnalyticsClientsArgs = {
  orgId: string;
};

export type GenerateOnboardingLinkArgs = {
  orgId: string;
  userId: string;
};

export type VerifyOnboardingTokenArgs = {
  token: string;
};

export type SubmitOnboardingClientArgs = {
  input: SubmitOnboardingClientInputSchema;
};

export type UpdateAvatarArgs = {
  input: UpdateAvatarInputSchema;
};

export type DeleteAvatarArgs = {
  input: DeleteAvatarInputSchema;
};

export type UpgradeMembershipPlanArgs = {
  input: UpgradeMembershipPlanInputSchema;
};

export type RenewMembershipPlanArgs = {
  input: RenewMembershipPlanInputSchema;
};

export type CreateClientIncomeArgs = {
  plan: IMembershipPlanSchema;
  orgId: string;
  clientId?: string;
  paymentDetail?: CreateClientInputSchema['paymentDetail'];
  docSave?: boolean;
};

export type CurrentMembershipPlanArgs = {
  clientId: string;
};
