import { authRouter } from '@/server/api/routers/auth/auth.router';
import { userRouter } from '@/server/api/routers/user/user.router';
import { createTRPCRouter } from '@/server/api/trpc';

import { checkInRouter } from './routers/check-in/check-in.router';
import { clientRouter } from './routers/client/client.router';
import { contactRouter } from './routers/contact/contact.router';
import { incomeRouter } from './routers/income/income.router';
import { membershipPlanRouter } from './routers/membership-plan/membership-plan.router';
import { organizationRouter } from './routers/organization/organization.router';
import { timeLogRouter } from './routers/time-log/time-log.router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: userRouter,
  clients: clientRouter,
  contacts: contactRouter,
  incomes: incomeRouter,
  membershipPlans: membershipPlanRouter,
  organizations: organizationRouter,
  checkIn: checkInRouter,
  timeLogs: timeLogRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
