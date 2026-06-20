import type {
  DeleteAvatarInputSchema,
  UpdateAvatarInputSchema,
  UpdateUserInputSchema,
} from '../user.input';

export type GetUserByIdArgs = {
  id: string;
};

export type UpdateUserArgs = {
  input: UpdateUserInputSchema;
};

export type GetOnboardingUserArgs = {
  userId: string;
};

export type UpdateAvatarArgs = {
  input: UpdateAvatarInputSchema;
};

export type DeleteAvatarArgs = {
  input: DeleteAvatarInputSchema;
};
