import { TRPCError } from '@trpc/server';
import type { FilterQuery } from 'mongoose';

import { Logger } from '@/server/logger/logger';

import { ContactModel, type IContactDocument, type IContactSchema } from '../model/contact.model';
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
  async createContact({
    input,
    ipAddress,
    userAgent,
  }: CreateContactProps): Promise<IContactSchema> {
    try {
      const contact = new ContactModel({
        ...input,
        ipAddress,
        userAgent,
      });

      await contact.save();

      this.logger.info('Contact submission created successfully', {
        contactId: contact.id,
        email: contact.email,
        type: contact.type,
      });

      return await contact.toObject();
    } catch (error) {
      this.logger.error('Failed to create contact submission', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to submit contact form. Please try again later.',
      });
    }
  }

  /**
   * Get contacts with pagination and filtering
   */
  async getContacts({ input }: GetContactsProps) {
    try {
      const { page, limit, search, type, status } = input;

      // Build filter query
      const filter: FilterQuery<IContactDocument> = {};

      if (search) {
        filter.$text = { $search: search };
      }

      if (type) {
        filter.type = type;
      }

      if (status) {
        filter.status = status;
      }

      const result = await ContactModel.findWithPagination(filter, page, limit);

      const contacts = result.contacts.map(contact => contact.toObject());

      return {
        contacts,
        pagination: {
          total: result.total,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNextPage: result.currentPage < result.totalPages,
          hasPreviousPage: result.currentPage > 1,
        },
      };
    } catch (error) {
      this.logger.error('Failed to fetch contacts', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch contacts.',
      });
    }
  }

  /**
   * Update contact status and add admin notes
   */
  async updateContactStatus({ input }: UpdateContactStatusProps): Promise<IContactSchema> {
    try {
      const { id, status, adminNotes } = input;

      const contact = await ContactModel.findById(id);

      if (!contact) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contact not found.',
        });
      }

      contact.status = status;
      if (adminNotes !== undefined) {
        contact.adminNotes = adminNotes;
      }

      await contact.save();

      this.logger.info('Contact status updated', {
        contactId: contact.id,
        newStatus: status,
      });

      return await contact.toObject();
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      this.logger.error('Failed to update contact status', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update contact status.',
      });
    }
  }

  /**
   * Get contact by ID
   */
  async getContactById(id: string): Promise<IContactSchema> {
    try {
      const contact = await ContactModel.findById(id);

      if (!contact) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contact not found.',
        });
      }

      return await contact.toObject();
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      this.logger.error('Failed to fetch contact by ID', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch contact.',
      });
    }
  }
}

export const contactService = new ContactService();
