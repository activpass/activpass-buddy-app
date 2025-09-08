/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from '@trpc/server';

import { Logger } from '@/server/logger/logger';

import { clientRepository } from '../client/repository/client.repository';
import type { ClientDashboardData, GetClientDashboardArgs } from './client-dashboard.types';

class ClientDashboardService {
  private readonly logger = new Logger(ClientDashboardService.name);

  getDashboardData = async ({
    clientId,
    organizationId,
  }: GetClientDashboardArgs): Promise<ClientDashboardData> => {
    try {
      // Fetch client data with populated fields
      const client = await clientRepository.getPopulatedById(clientId);

      // Verify client belongs to the organization (convert ObjectId to string)
      const clientOrgId =
        typeof client.organization === 'object'
          ? (client.organization as any)._id?.toString() ||
            (client.organization as any).id?.toString() ||
            ''
          : (client.organization as any)?.toString() || '';

      if (clientOrgId !== organizationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Client does not belong to the specified organization',
        });
      }

      // Calculate membership status
      const membershipStatus = this.calculateMembershipStatus(client);

      // Generate mock fitness stats (replace with actual data from your fitness tracking system)
      const fitnessStats = await this.getFitnessStats(clientId);

      // Generate mock achievements (replace with actual achievement system)
      const achievements = await this.getAchievements(clientId);

      // Generate mock upcoming classes (replace with actual class booking system)
      const upcomingClasses = await this.getUpcomingClasses(clientId, organizationId);

      // Handle populated organization data
      const organization =
        typeof client.organization === 'object' && client.organization !== null
          ? client.organization
          : {
              id:
                (client.organization as any)?._id?.toString() ||
                (client.organization as any)?.id?.toString() ||
                '',
              name: 'Organization',
              type: 'fitness',
            };

      // Handle populated membership plan data
      const membershipPlan =
        typeof client.membershipPlan === 'object' && client.membershipPlan !== null
          ? client.membershipPlan
          : {
              id:
                (client.membershipPlan as any)?._id?.toString() ||
                (client.membershipPlan as any)?.id?.toString() ||
                '',
              name: 'Basic Plan',
              description: '',
              amount: 0,
              tenure: 'MONTHLY',
            };

      return {
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phoneNumber: client.phoneNumber,
          avatar: client.avatar
            ? {
                url: client.avatar.url || '',
                fileId: client.avatar.fileId || '',
              }
            : undefined,
          checkInDate: client.checkInDate || undefined,
          joiningDate: client.createdAt,
        },
        organization: {
          id: typeof organization === 'object' ? organization.id : organization,
          name:
            typeof organization === 'object'
              ? (organization as any).name || 'Organization'
              : 'Organization',
          type:
            typeof organization === 'object' ? (organization as any).type || 'fitness' : 'fitness',
        },
        membershipPlan: {
          id: typeof membershipPlan === 'object' ? membershipPlan.id : membershipPlan,
          name:
            typeof membershipPlan === 'object'
              ? (membershipPlan as any).name || 'Basic Plan'
              : 'Basic Plan',
          description:
            typeof membershipPlan === 'object' ? (membershipPlan as any).description || '' : '',
          price:
            typeof membershipPlan === 'object'
              ? (membershipPlan as any).totalAmount || (membershipPlan as any).amount || 0
              : 0,
          features:
            typeof membershipPlan === 'object'
              ? (membershipPlan as any).features?.map((f: any) => f.value) || []
              : [],
          tenure: this.getTenureDuration(membershipPlan),
          tenureType: this.getTenureType(membershipPlan),
        },
        fitnessStats,
        membershipStatus,
        achievements,
        upcomingClasses,
      };
    } catch (error) {
      this.logger.error('Failed to get client dashboard data', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get client dashboard data',
      });
    }
  };

  private calculateMembershipStatus(client: any) {
    // This is a simplified calculation - adjust based on your actual membership logic
    const startDate = client.createdAt;
    let tenureInDays = 30; // default

    // Handle populated membership plan data
    const membershipPlan = typeof client.membershipPlan === 'object' ? client.membershipPlan : null;

    if (membershipPlan?.tenure === 'MONTHLY') {
      tenureInDays = 30;
    } else if (membershipPlan?.tenure === 'QUARTERLY') {
      tenureInDays = 90;
    } else if (membershipPlan?.tenure === 'HALF_YEARLY') {
      tenureInDays = 180;
    } else if (membershipPlan?.tenure === 'YEARLY') {
      tenureInDays = 365;
    } else {
      tenureInDays = 30;
    }

    const totalDays = tenureInDays;
    const daysPassed = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysPassed);

    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setDate(nextPaymentDate.getDate() + totalDays);

    return {
      status: daysRemaining > 0 ? ('active' as const) : ('expired' as const),
      daysRemaining,
      nextPayment: nextPaymentDate,
      totalDays,
    };
  }

  private async getFitnessStats(_clientId: string) {
    // Mock data - replace with actual fitness tracking queries
    // You could fetch from workout logs, check-ins, etc.
    return {
      totalWorkouts: Math.floor(Math.random() * 30) + 20,
      monthlyGoal: 30,
      streak: Math.floor(Math.random() * 10) + 1,
      calories: Math.floor(Math.random() * 2000) + 2000,
      avgDuration: Math.floor(Math.random() * 30) + 45,
    };
  }

  private async getAchievements(_clientId: string) {
    // Mock data - replace with actual achievement system
    const allAchievements = [
      { id: '1', title: '5-Day Streak', icon: '🔥', earned: Math.random() > 0.3 },
      { id: '2', title: 'Early Bird', icon: '🌅', earned: Math.random() > 0.4 },
      { id: '3', title: 'Goal Crusher', icon: '🎯', earned: Math.random() > 0.6 },
      { id: '4', title: 'Social Butterfly', icon: '👥', earned: Math.random() > 0.5 },
      { id: '5', title: 'Marathon Runner', icon: '🏃‍♂️', earned: Math.random() > 0.7 },
      { id: '6', title: 'Strength Master', icon: '💪', earned: Math.random() > 0.8 },
    ];

    return allAchievements.map(achievement => ({
      ...achievement,
      earnedDate: achievement.earned
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        : undefined,
    }));
  }

  private async getUpcomingClasses(_clientId: string, _organizationId: string) {
    // Mock data - replace with actual class booking system
    const instructors = [
      'Sarah Johnson',
      'Mike Chen',
      'Lisa Rodriguez',
      'Alex Thompson',
      'Emma Wilson',
    ];
    const classTypes = [
      'Morning Yoga',
      'HIIT Training',
      'Strength Training',
      'Pilates',
      'Zumba',
      'CrossFit',
    ];

    const classes: Array<{
      id: string;
      name: string;
      instructor: string;
      time: string;
      date: string;
      duration: number;
      spots: number;
    }> = [];
    const now = new Date();

    for (let i = 0; i < 5; i += 1) {
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + i);

      let dateString = '';
      if (i === 0) {
        dateString = 'Today';
      } else if (i === 1) {
        dateString = 'Tomorrow';
      } else {
        dateString = futureDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
      }

      classes.push({
        id: `class-${i + 1}`,
        name: classTypes[Math.floor(Math.random() * classTypes.length)] || 'Fitness Class',
        instructor: instructors[Math.floor(Math.random() * instructors.length)] || 'Instructor',
        time: `${Math.floor(Math.random() * 12) + 6}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        date: dateString,
        duration: Math.floor(Math.random() * 30) + 30,
        spots: Math.floor(Math.random() * 10) + 1,
      });
    }

    return classes;
  }

  private getTenureDuration(membershipPlan: any): number {
    if (typeof membershipPlan !== 'object') {
      return 1;
    }

    const { tenure } = membershipPlan as any;
    switch (tenure) {
      case 'MONTHLY':
        return 1;
      case 'QUARTERLY':
        return 3;
      case 'HALF_YEARLY':
        return 6;
      case 'YEARLY':
        return 12;
      default:
        return 1;
    }
  }

  private getTenureType(membershipPlan: any): 'months' | 'years' {
    if (typeof membershipPlan !== 'object') {
      return 'months';
    }

    const { tenure } = membershipPlan as any;
    return tenure === 'YEARLY' ? 'years' : 'months';
  }
}

export const clientDashboardService = new ClientDashboardService();
