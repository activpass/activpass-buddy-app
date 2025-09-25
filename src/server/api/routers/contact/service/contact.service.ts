import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger/logger';
import type { IContactSchema } from '@/validations/contact.validation';

import { contactRepository } from '../repository/contact.repository';
import type {
  CreateContactProps,
  GetContactsProps,
  UpdateContactStatusProps,
} from './contact.service.types';

class ContactService {
  private readonly logger = new Logger(ContactService.name);

  /**
   * Create a new contact submission
   */
  async createContact({ input, ipAddress, userAgent }: CreateContactProps) {
    try {
      return await contactRepository.createContact({ input, ipAddress, userAgent });
    } catch (error) {
      this.logger.error('Failed to create contact submission', error);
      throw getTRPCError(error);
    }
  }

  /**
   * Get contacts with pagination and filtering
   */
  async getContacts({ input }: GetContactsProps) {
    try {
      return await contactRepository.getContacts({ input });
    } catch (error) {
      this.logger.error('Failed to fetch contacts', error);
      throw getTRPCError(error);
    }
  }

  /**
   * Update contact status and add admin notes
   */
  async updateContactStatus({ input }: UpdateContactStatusProps): Promise<IContactSchema> {
    try {
      return await contactRepository.updateContactStatus({ input });
    } catch (error) {
      this.logger.error('Failed to update contact status', error);
      throw getTRPCError(error);
    }
  }

  /**
   * Get contact by ID
   */
  async getContactById(id: string): Promise<IContactSchema> {
    try {
      return await contactRepository.getContactById(id);
    } catch (error) {
      this.logger.error('Failed to fetch contact by ID', error);
      throw getTRPCError(error);
    }
  }
}

export const contactService = new ContactService();
