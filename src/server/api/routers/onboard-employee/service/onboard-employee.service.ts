import { TRPCError } from '@trpc/server';

import { env } from '@/env';
import { generateMongooseObjectId } from '@/server/api/helpers/common';
import {
  sendEmployeeOnboardingEmail,
  sendEmployeeOnboardingSuccessEmail,
  sendOwnerEmployeeOnboardingNotificationEmail,
} from '@/server/api/services/email';
import { logger } from '@/server/logger';
import type { EmployeeFormSchema } from '@/validations/employee/add-form.validation';

import { employeeService } from '../../employees/service/employee.service';
import { organizationService } from '../../organization/service/organization.service';
import type { IUserSchema } from '../../user/model/user.model';
import {
  OnboardEmployeeExpiredError,
  OnboardEmployeeNotFoundError,
} from '../model/onboard-employee.model.types';
import type {
  IOnboardEmployeeCompletion,
  IOnboardEmployeeTokenVerification,
} from '../onboard-employee.input';
import { OnboardEmployeeRepository } from '../repository/onboard-employee.repository';

export class OnboardEmployeeService {
  /**
   * Verify onboarding token
   */
  static async verifyToken(data: IOnboardEmployeeTokenVerification) {
    try {
      const result = await OnboardEmployeeRepository.verifyToken(data.token);
      return {
        token: result.token,
        onBoarded: !!result.employee,
        organization: {
          name: result.organization.name,
          type: result.organization.type,
          id: result.organization.id,
        },
      };
    } catch (error) {
      if (error instanceof OnboardEmployeeNotFoundError) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid onboarding token',
          cause: error,
        });
      }

      if (error instanceof OnboardEmployeeExpiredError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Onboarding token has expired',
          cause: error,
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to verify onboarding token',
        cause: error,
      });
    }
  }

  /**
   * Get onboarding by token
   */
  static async getOnboardingByToken(token: string) {
    try {
      return await OnboardEmployeeRepository.getByToken(token);
    } catch (error) {
      if (error instanceof OnboardEmployeeNotFoundError) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid onboarding token',
          cause: error,
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get onboarding',
        cause: error,
      });
    }
  }

  /**
   * Complete employee onboarding
   */
  static async completeOnboarding(data: IOnboardEmployeeCompletion) {
    // Mark onboarding as completed
    const onboarding = await OnboardEmployeeRepository.complete(data.token);

    if (onboarding.employee) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Employee onboarding has already been completed',
      });
    }

    // Create employee from onboarding data
    const employeeDoc = await this.createEmployeeFromOnboardingData(
      data.employeeData,
      onboarding.organization._id.toString()
    );

    // Link the created employee to the onboarding record
    onboarding.employee = generateMongooseObjectId(employeeDoc.id);
    await onboarding.save();

    // Send success emails after successful onboarding
    await this.sendOnboardingCompletionEmails(
      employeeDoc,
      onboarding.organization._id.toString(),
      onboarding.createdBy.toString()
    );

    return {
      onboarding,
      message: 'Employee onboarding completed successfully',
    };
  }

  /**
   * Create new employee from onboarding form data
   */
  private static async createEmployeeFromOnboardingData(
    employeeFormData: EmployeeFormSchema,
    organizationId: string
  ) {
    try {
      // Map employee form data to employee creation schema
      const employeeData = {
        // Use existing user data or form data
        firstName: employeeFormData.firstName || '',
        lastName: employeeFormData.lastName || '',
        email: employeeFormData.email || '',
        phoneNumber: employeeFormData.phoneNumber || 0,
        gender: employeeFormData.gender,
        dob: employeeFormData.dob,
        address: employeeFormData.address,

        // Employee-specific data from form
        emergencyContact: employeeFormData.emergencyContact,
        bank: employeeFormData.bank,
        jobDetails: employeeFormData.jobDetails,
        workSchedule: employeeFormData.workSchedule,
        payroll: employeeFormData.payroll,
      };

      // Create the employee using the employee service
      const newEmployee = await employeeService.create(employeeData, organizationId);

      logger.log(`Successfully created new employee ${newEmployee.id} from onboarding completion.`);
      return newEmployee;
    } catch (error) {
      logger.error('Error creating employee from onboarding data:', error);
      throw new Error(`Failed to create employee from onboarding data: ${error}`);
    }
  }

  static generateOnboardingLink = async (userId: string, orgId: string) => {
    try {
      const doc = await OnboardEmployeeRepository.create({
        organization: generateMongooseObjectId(orgId),
        createdBy: generateMongooseObjectId(userId),
      });
      return doc;
    } catch (error) {
      logger.error('Failed to generate onboarding external link', error);
      throw error;
    }
  };

  static generateOnboardingFormUrl = (token: string) => {
    return `${env.NEXTAUTH_URL}/onboard/employee?token=${token}`;
  };

  static sendOnboardingLinkThroughEmail = async (
    email: string,
    userId: string,
    orgId: string,
    options: {
      organizationName?: string;
      organizationOwnerName?: string;
      customMessage?: string;
      expirationDays?: number;
    } = {}
  ) => {
    try {
      // Fetch onboarding record by email (assuming email is unique and linked to user)
      try {
        const onboarding = await employeeService.getByEmail(email, orgId);
        if (onboarding) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Employee with this email already exists',
          });
        }
      } catch {
        // Employee does not exist, which is expected
      }

      const data = await this.generateOnboardingLink(userId, orgId);
      const onboardingLink = this.generateOnboardingFormUrl(data.token);

      // Get organization details if not provided
      let { organizationName } = options;
      if (!organizationName) {
        try {
          const organization = await organizationService.getById({ id: orgId });
          organizationName = organization.name;
        } catch (error) {
          logger.error('Could not fetch organization name, using default', error);
          organizationName = 'Your Organization';
        }
      }

      // Send onboarding email using the email service
      await sendEmployeeOnboardingEmail({
        recipientEmail: email,
        organizationName,
        onboardingUrl: onboardingLink,
        organizationOwnerName: options.organizationOwnerName,
        customMessage: options.customMessage,
        expirationDays: options.expirationDays || 7,
      });

      logger.log(`Onboarding email sent successfully to ${email}`);

      return {
        message: 'Onboarding link sent successfully',
        onboardingLink, // Include link for testing/debugging purposes
      };
    } catch (error) {
      logger.error('Failed to send onboarding link through email', error);
      throw error;
    }
  };

  /**
   * Enhanced method that sends onboarding email with automatic organization data fetching
   */
  static sendOnboardingEmailWithOrgDetails = async (
    email: string,
    userId: string,
    orgId: string,
    options: {
      customMessage?: string;
      expirationDays?: number;
    } = {}
  ) => {
    try {
      // Fetch organization and owner details automatically
      const organization = await organizationService.getById({ id: orgId });
      const populatedDoc = await organization.populate<{
        users: Pick<IUserSchema, 'firstName' | 'lastName' | 'id' | 'fullName'>[];
      }>('users', 'firstName lastName id');
      const currentUser = populatedDoc.users.find(user => user.id === userId);

      if (!currentUser) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to send onboarding emails for this organization',
        });
      }

      // const populatedUser = currentUser.
      await this.sendOnboardingLinkThroughEmail(email, userId, orgId, {
        organizationName: organization.name,
        organizationOwnerName: currentUser?.fullName || '',
        customMessage: options.customMessage,
        expirationDays: options.expirationDays,
      });

      return { message: 'Onboarding email sent successfully' };
    } catch (error) {
      logger.error('Failed to send onboarding email with org details', error);
      throw error;
    }
  };

  /**
   * Send completion emails to both employee and organization owner
   */
  private static async sendOnboardingCompletionEmails(
    employeeDoc: IUserSchema,
    orgId: string,
    createdBy: string
  ) {
    try {
      const completionDate = new Date().toLocaleDateString();

      const organization = await organizationService.getById({ id: orgId });

      // Populate organization and createdBy details if needed
      const populatedOrg = await organization.populate<{
        users: Pick<IUserSchema, 'firstName' | 'lastName' | 'email' | 'fullName' | '_id'>[];
      }>('users', 'firstName lastName email fullName');
      const orgOwner = populatedOrg.users.find(
        user => user._id.toString() === createdBy.toString()
      );

      // Send both emails concurrently using Promise.allSettled
      const emailPromises = [
        // Email 1: Success email to the employee
        sendEmployeeOnboardingSuccessEmail({
          employeeName: `${employeeDoc.firstName} ${employeeDoc.lastName}`,
          employeeEmail: employeeDoc.email,
          organizationName: organization.name,
          jobTitle: employeeDoc.jobDetails?.title || undefined,
          startDate: employeeDoc.createdAt
            ? new Date(employeeDoc.createdAt).toLocaleDateString()
            : undefined,
        }).then(() => ({ type: 'employee', email: employeeDoc.email })),
      ];

      // Email 2: Notification email to the organization owner (if exists)
      if (orgOwner) {
        emailPromises.push(
          sendOwnerEmployeeOnboardingNotificationEmail({
            ownerName: orgOwner.fullName || `${orgOwner.firstName} ${orgOwner.lastName}`,
            ownerEmail: orgOwner.email,
            employeeName: `${employeeDoc.firstName} ${employeeDoc.lastName}`,
            employeeEmail: employeeDoc.email,
            organizationName: organization.name,
            onboardingCompletedAt: completionDate,
            jobTitle: employeeDoc.jobDetails?.title || undefined,
          }).then(() => ({ type: 'owner', email: orgOwner.email }))
        );
      } else {
        logger.error('Could not find organization owner to send notification email');
      }

      // Execute all email promises concurrently
      const emailResults = await Promise.allSettled(emailPromises);

      // Log results for each email
      emailResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { type, email } = result.value;
          logger.log(`Onboarding ${type} email sent successfully to: ${email}`);
        } else {
          const emailType = index === 0 ? 'employee' : 'owner';
          logger.error(`Failed to send onboarding ${emailType} email:`, result.reason);
        }
      });
    } catch (error) {
      // Log the error but don't fail the onboarding process
      logger.error('Failed to send onboarding completion emails:', error);
      // Note: We don't throw the error here to avoid failing the entire onboarding process
      // The onboarding should succeed even if email sending fails
    }
  }
}
