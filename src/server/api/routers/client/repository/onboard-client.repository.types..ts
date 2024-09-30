import type { UpdateOnboardClientInputSchema } from '../client.input';

export type CreateOnboardClientParams = {
  orgId: string;
  userId: string;
  docSave?: boolean;
};

export type ListClientParams = {
  orgId: string;
};

export type UpdateOnboardClientParams = {
  id: string;
  data: UpdateOnboardClientInputSchema['data'];
};

export type ListOnboardClientParams = {
  orgId: string;
};

export type GenerateOnboardingLinkParams = {
  orgId: string;
  userId: string;
};

export type VerifyOnboardingTokenParams = {
  token: string;
};
