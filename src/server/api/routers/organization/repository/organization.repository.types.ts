import type { IOrganizationSchema } from '../model/organization.model';
import type {
  CreateOrganizationInputSchema,
  UpdateOrganizationInputSchema,
} from '../organization.input';

export type CreateOrganizationParams = {
  data: CreateOrganizationInputSchema;
};

export type UpdateOrganizationParams = {
  id: IOrganizationSchema['id'];
  data: UpdateOrganizationInputSchema['data'];
};

export type ListOrganizationsParams = {
  userId: string;
};

export type AddUserToOrganizationParams = {
  orgId: string;
  userId: string;
  isUpdateCreatedById?: boolean;
};
