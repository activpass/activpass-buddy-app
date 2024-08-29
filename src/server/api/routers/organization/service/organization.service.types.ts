import type {
  CreateOrganizationInputSchema,
  UpdateOrganizationInputSchema,
} from '../organization.input';

export type GetOrganizationByIdArgs = {
  id: string;
};

export type CreateOrganizationArgs = {
  input: CreateOrganizationInputSchema;
};

export type UpdateOrganizationArgs = {
  input: UpdateOrganizationInputSchema;
};

export type ListOrganizationsArgs = {
  userId: string;
};
