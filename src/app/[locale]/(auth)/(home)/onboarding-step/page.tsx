import { RedirectType } from 'next/navigation';

import { redirect } from '@/lib/navigation';
import { api } from '@/trpc/server';

import { OnboardingStepClientPage } from './page.client';

export const metadata = {
  title: 'Onboarding Step',
  description: 'Complete your onboarding process',
};

type OnboardingStepPageProps = {
  searchParams: {
    userId: string | null;
  };
};
const OnboardingStepPage = async ({ searchParams }: OnboardingStepPageProps) => {
  const { userId } = searchParams;

  if (!userId) {
    throw new Error('User ID is required');
  }

  const onboardingUser = await api.users.getOnboardingUser({ userId });

  if (onboardingUser.isOnboardingComplete) {
    return redirect('/dashboard', RedirectType.replace);
  }

  return <OnboardingStepClientPage userEmail={onboardingUser.email} userId={onboardingUser.id} />;
};

export default OnboardingStepPage;
