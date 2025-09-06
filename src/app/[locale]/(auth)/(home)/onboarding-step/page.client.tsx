'use client';

import { toast } from '@paalan/react-ui';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { api } from '@/trpc/client';
import type { OnboardingCompleteSchema } from '@/validations/onboarding.validation';

import { OnboardingCompletionForm } from './_components/OnboardingCompletionForm';
import { OnboardingStepper } from './_components/OnboardingStepper';
import { uploadFacilityLogo, uploadProfilePicture } from './_helpers';

type OnboardingStepClientPageProps = {
  userId: string;
  userEmail: string;
};
export const OnboardingStepClientPage = ({ userId, userEmail }: OnboardingStepClientPageProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginToken, setLoginToken] = useState<string | null>(null);

  const createOnboardingStepMutation = api.auth.createOnboardingStep.useMutation();

  const handleComplete = async (data: OnboardingCompleteSchema) => {
    const { picture } = data.profileSetup;
    const { logo } = data.facilitySetup;

    let avatarImageKitResponse;
    let logoUrlImageKitResponse;
    try {
      setIsSubmitting(true);

      // Upload images if they exist and get their URLs
      avatarImageKitResponse = await uploadProfilePicture(picture);

      // Upload facility logo if it exists and get its URL
      logoUrlImageKitResponse = await uploadFacilityLogo(logo);

      const response = await createOnboardingStepMutation.mutateAsync({
        userId,
        data: {
          profileSetup: {
            ...data.profileSetup,
            avatar: avatarImageKitResponse,
          },
          facilitySetup: {
            ...data.facilitySetup,
            logo: logoUrlImageKitResponse,
          },
        },
      });

      await signOut({ redirect: false }); // Sign out the user to clear any existing session

      toast.success('Onboarding completed successfully!');
      setLoginToken(response.loginToken);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loginToken) {
    return <OnboardingCompletionForm loginToken={loginToken} />;
  }

  return (
    <OnboardingStepper
      onComplete={handleComplete}
      userEmail={userEmail}
      isSubmitting={isSubmitting}
    />
  );
};
