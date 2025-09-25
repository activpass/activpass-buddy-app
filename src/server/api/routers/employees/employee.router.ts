import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  changePasswordInputSchema,
  createEmployeeInputSchema,
  deleteAvatarInputSchema,
  deleteEmployeeInputSchema,
  getEmployeeInputSchema,
  listEmployeesInputSchema,
  updateAvatarInputSchema,
  updateEmployeeInputSchema,
} from './employee.input';
import { employeeService } from './service/employee.service';

export const employeesRouter = createTRPCRouter({
  // Basic CRUD operations
  get: protectedProcedure.input(getEmployeeInputSchema).query(async ({ input }) => {
    return employeeService.getById(input.id);
  }),

  create: protectedProcedure.input(createEmployeeInputSchema).mutation(async ({ ctx, input }) => {
    return employeeService.create(input, ctx.session.user.orgId);
  }),

  update: protectedProcedure.input(updateEmployeeInputSchema).mutation(async ({ ctx, input }) => {
    return employeeService.update(input.id, input.data, ctx.session.user.orgId);
  }),

  list: protectedProcedure.input(listEmployeesInputSchema).query(async ({ ctx, input }) => {
    return employeeService.list(ctx.session.user.orgId, {
      role: input.role,
      page: input.page,
      limit: input.limit,
    });
  }),

  delete: protectedProcedure.input(deleteEmployeeInputSchema).mutation(async ({ ctx, input }) => {
    return employeeService.delete(input.id, ctx.session.user.orgId);
  }),

  // Analytics and reporting
  analytics: protectedProcedure.query(async ({ ctx }) => {
    return employeeService.analytics(ctx.session.user.orgId);
  }),

  getReportingManagers: protectedProcedure.query(async ({ ctx }) => {
    return employeeService.getReportingManagers(ctx.session.user.orgId);
  }),

  // Security operations
  changePassword: protectedProcedure
    .input(changePasswordInputSchema)
    .mutation(async ({ ctx, input }) => {
      return employeeService.changePassword(
        input.employeeCode,
        ctx.session.user.orgId,
        input.currentPassword,
        input.newPassword
      );
    }),

  // Convenience endpoints
  getTotalCount: protectedProcedure.query(async ({ ctx }) => {
    const analytics = await employeeService.analytics(ctx.session.user.orgId);
    return { totalEmployeeCount: analytics.totalEmployeeCount };
  }),

  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const analytics = await employeeService.analytics(ctx.session.user.orgId);
    return {
      totalEmployeeCount: analytics.totalEmployeeCount,
      presentCount: analytics.presentCount,
      absentCount: analytics.absentCount,
      newEmployeesThisMonth: analytics.newEmployeesThisMonth,
    };
  }),

  // Placeholder endpoints for future implementation
  getPaySlips: protectedProcedure
    .input(z.object({ employeeCode: z.string() }))
    .query(async ({ ctx, input }) => {
      return employeeService.getPaySlips(input.employeeCode, ctx.session.user.orgId);
    }),

  getAttendance: protectedProcedure
    .input(z.object({ employeeCode: z.string() }))
    .query(async ({ ctx, input }) => {
      return employeeService.getAttendance(input.employeeCode, ctx.session.user.orgId);
    }),
  updateAvatar: protectedProcedure.input(updateAvatarInputSchema).mutation(async ({ input }) => {
    return employeeService.updateAvatar({
      input,
    });
  }),
  deleteAvatar: protectedProcedure.input(deleteAvatarInputSchema).mutation(async ({ input }) => {
    return employeeService.deleteAvatar({
      input,
    });
  }),
});
