import type { UpdateUserInputSchema } from '../user.input';

export type GetUserByIdArgs = {
  id: string;
};

export type UpdateUserArgs = {
  input: UpdateUserInputSchema;
};

export type GetOnboardingUserArgs = {
  userId: string;
};
