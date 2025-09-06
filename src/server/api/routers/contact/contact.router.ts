import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import {
  createContactInputSchema,
  getContactsInputSchema,
  updateContactStatusInputSchema,
} from './contact.input';
import { contactService } from './service/contact.service';

export const contactRouter = createTRPCRouter({
  // Public endpoint for creating contact submissions
  create: publicProcedure.input(createContactInputSchema).mutation(async ({ input, ctx }) => {
    // Extract IP address and user agent from headers
    const ipAddress =
      ctx.headers.get('x-forwarded-for') || ctx.headers.get('x-real-ip') || 'unknown';
    const userAgent = ctx.headers.get('user-agent') || 'unknown';

    const result = await contactService.createContact({
      input,
      ipAddress,
      userAgent,
    });

    return result;
  }),

  // Protected endpoints for admin use
  list: protectedProcedure.input(getContactsInputSchema).query(async ({ input }) => {
    const result = await contactService.getContacts({ input });
    return result;
  }),

  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const result = await contactService.getContactById(input.id);
    return result;
  }),

  updateStatus: protectedProcedure
    .input(updateContactStatusInputSchema)
    .mutation(async ({ input }) => {
      const result = await contactService.updateContactStatus({ input });
      return result;
    }),
});
