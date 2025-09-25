import { authRouter } from '@/server/api/routers/auth/auth.router';
import { userRouter } from '@/server/api/routers/user/user.router';
import { createTRPCRouter } from '@/server/api/trpc';

import { checkInRouter } from './routers/check-in/check-in.router';
import { clientRouter } from './routers/client/client.router';
import { clientDashboardRouter } from './routers/client-dashboard/client-dashboard.router';
import { contactRouter } from './routers/contact/contact.router';
import { employeesRouter } from './routers/employees/employee.router';
import { incomeRouter } from './routers/income/income.router';
import { membershipPlanRouter } from './routers/membership-plan/membership-plan.router';
import { onboardEmployeeRouter } from './routers/onboard-employee/onboard-employee.router';
import { organizationRouter } from './routers/organization/organization.router';
import { permissionRouter } from './routers/permission/permission.router';
import { roleRouter } from './routers/role/role.router';
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
  clientDashboard: clientDashboardRouter,
  contacts: contactRouter,
  employees: employeesRouter,
  incomes: incomeRouter,
  membershipPlans: membershipPlanRouter,
  onboardEmployee: onboardEmployeeRouter,
  organizations: organizationRouter,
  permissions: permissionRouter,
  roles: roleRouter,
  checkIn: checkInRouter,
  timeLogs: timeLogRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
