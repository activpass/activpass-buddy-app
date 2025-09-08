export interface GetClientDashboardArgs {
  clientId: string;
  organizationId: string;
}

export interface ClientDashboardData {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    avatar?: {
      url: string;
      fileId: string;
    };
    checkInDate?: Date;
    joiningDate: Date;
  };
  organization: {
    id: string;
    name: string;
    type: string;
  };
  membershipPlan: {
    id: string;
    name: string;
    description?: string;
    price: number;
    features?: string[];
    tenure: number;
    tenureType: 'days' | 'months' | 'years';
  };
  fitnessStats: {
    totalWorkouts: number;
    monthlyGoal: number;
    streak: number;
    calories: number;
    avgDuration: number;
  };
  membershipStatus: {
    status: 'active' | 'inactive' | 'expired';
    daysRemaining: number;
    nextPayment?: Date;
    totalDays: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    icon: string;
    earned: boolean;
    earnedDate?: Date;
  }>;
  upcomingClasses: Array<{
    id: string;
    name: string;
    instructor: string;
    time: string;
    date: string;
    duration: number;
    spots: number;
  }>;
}
