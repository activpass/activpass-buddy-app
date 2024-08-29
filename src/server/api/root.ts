import { authRouter } from '@/server/api/routers/auth/auth.router';
import { userRouter } from '@/server/api/routers/user/user.router';
import { createTRPCRouter } from '@/server/api/trpc';

import { checkinTokenRouter } from './routers/checkin-token/checkin-token.router';
import { clientRouter } from './routers/client/client.router';
import { incomeRouter } from './routers/income/income.router';
import { membershipPlanRouter } from './routers/membership-plan/membership-plan.router';
import { organizationRouter } from './routers/organization/organization.router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: userRouter,
  clients: clientRouter,
  income: incomeRouter,
  membershipPlan: membershipPlanRouter,
  organization: organizationRouter,
  checkinToken: checkinTokenRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
