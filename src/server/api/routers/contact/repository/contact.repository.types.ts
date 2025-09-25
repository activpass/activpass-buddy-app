import type {
  CreateContactInputSchema,
  GetContactsInputSchema,
  UpdateContactStatusInputSchema,
} from '../contact.input';

export interface CreateContactProps {
  input: CreateContactInputSchema;
  ipAddress?: string;
  userAgent?: string;
}

export interface GetContactsProps {
  input: GetContactsInputSchema;
}

export interface UpdateContactStatusProps {
  input: UpdateContactStatusInputSchema;
}
