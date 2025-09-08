import { z } from 'zod';

export const getClientDashboardInputSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
});

export type GetClientDashboardInput = z.infer<typeof getClientDashboardInputSchema>;
