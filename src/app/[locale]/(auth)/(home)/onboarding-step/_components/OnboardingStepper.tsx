import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@paalan/react-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  type OnboardingCompleteSchema,
  type OnboardingFacilitySetupSchema,
  onboardingFacilitySetupSchema,
  type OnboardingProfileSetupSchema,
  onboardingProfileSetupSchema,
} from '@/validations/onboarding.validation';

import { OnboardingFacilitySetupForm } from './OnboardingFacilitySetupForm';
import { OnboardingProfileSetupForm } from './OnboardingProfileSetupForm';

type OnboardingStepperProps = {
  onComplete: (data: OnboardingCompleteSchema) => void;
  userEmail: string;
  isSubmitting: boolean;
};

export const OnboardingStepper = ({
  onComplete,
  userEmail,
  isSubmitting,
}: OnboardingStepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<OnboardingProfileSetupSchema | null>(null);

  const profileForm = useForm<OnboardingProfileSetupSchema>({
    resolver: zodResolver(onboardingProfileSetupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: userEmail,
      phoneNumber: undefined,
      picture: null,
    },
  });

  const facilityForm = useForm<OnboardingFacilitySetupSchema>({
    resolver: zodResolver(onboardingFacilitySetupSchema),
    defaultValues: {
      facilityName: '',
      businessType: undefined,
      logo: null,
      address: '',
      city: '',
      pincode: '',
    },
  });

  const handleProfileSubmit = (data: OnboardingProfileSetupSchema) => {
    setProfileData(data);
    setCurrentStep(2);
  };

  const handleFacilitySubmit = (data: OnboardingFacilitySetupSchema) => {
    if (!profileData) {
      toast.error('Profile data is missing');
      return;
    }
    onComplete({
      profileSetup: profileData,
      facilitySetup: data,
    });
  };

  const handleBackToProfile = () => {
    setCurrentStep(1);
  };

  switch (currentStep) {
    case 1:
      return <OnboardingProfileSetupForm onSubmit={handleProfileSubmit} form={profileForm} />;

    case 2:
      return (
        <OnboardingFacilitySetupForm
          onSubmit={handleFacilitySubmit}
          onBack={handleBackToProfile}
          isSubmitting={isSubmitting}
          form={facilityForm}
        />
      );

    default:
      return null;
  }
};
