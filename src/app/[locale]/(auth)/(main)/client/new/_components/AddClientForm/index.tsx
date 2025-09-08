'use client';

import { cn } from '@paalan/react-shared/lib';
import { Box, HStack, Strong, Text, VStack } from '@paalan/react-ui';
import { createElement, type FC, type FunctionComponent, useEffect, useMemo } from 'react';

import type { MembershipPlan } from '../../../../membership/types';
import { ADD_CLIENT_STEP_ID, ADD_CLIENT_STEPS } from './constants';
import { ClientInformationForm } from './stepper-forms/ClientInformationForm';
import { HealthAndFitnessForm } from './stepper-forms/HealthAndFitnessForm';
import { MembershipDetailsStepperForm } from './stepper-forms/MembershipDetailsStepperForm';
import { PaymentDetailsForm } from './stepper-forms/PaymentDetailsForm';
import { useClientFormStore } from './store';

export const ADD_CLIENT_STEPPER_COMPONENT: Record<
  keyof typeof ADD_CLIENT_STEP_ID,
  FunctionComponent
> = {
  [ADD_CLIENT_STEP_ID.CLIENT_INFORMATION]: ClientInformationForm,
  [ADD_CLIENT_STEP_ID.FITNESS_GOALS]: HealthAndFitnessForm,
  [ADD_CLIENT_STEP_ID.PURCHASE_PLAN]: MembershipDetailsStepperForm,
  [ADD_CLIENT_STEP_ID.PAYMENT_DETAILS]: PaymentDetailsForm,
};

const StepperComponent = () => {
  const currentStep = useClientFormStore(state => state.currentStep);

  const currentDescription = useMemo(() => {
    return ADD_CLIENT_STEPS.find(tab => tab.id === currentStep)?.description;
  }, [currentStep]);

  return (
    <VStack justifyContent="center">
      <HStack justifyContent="center" mb="2">
        {ADD_CLIENT_STEPS.map(({ label, id }) => (
          <Box
            key={id}
            className={cn('px-4 py-2', {
              'rounded-sm bg-primary text-white': currentStep === id,
            })}
          >
            <Strong>{label}</Strong>
          </Box>
        ))}
      </HStack>
      {/* Description */}
      {currentDescription && (
        <Text className="mb-8 text-center text-muted-foreground">{currentDescription}</Text>
      )}
      {/* Active Tab Content */}
      {/* Render the content of the active tab */}
      {/* If no active tab, show the first tab content */}
      {createElement(ADD_CLIENT_STEPPER_COMPONENT[currentStep])}
    </VStack>
  );
};

type AddClientFormProps = {
  membershipPlans?: MembershipPlan[];
  onboardClientId?: string;
  organization?: {
    name: string;
    type: string;
    id: string;
  };
};

export const AddClientForm: FC<AddClientFormProps> = ({
  membershipPlans = [],
  onboardClientId = '',
  organization,
}) => {
  const resetClientForm = useClientFormStore(state => state.resetClientForm);
  const setOnboardingData = useClientFormStore(state => state.setOnboardingData);

  useEffect(() => {
    return () => {
      // reset the form when the component is unmounted
      resetClientForm();
    };
  }, [resetClientForm]);

  /**
   * Set the onboarding data to the store
   */
  useEffect(() => {
    setOnboardingData({ membershipPlans, onboardClientId, organization: organization || null });
  }, [onboardClientId, membershipPlans, setOnboardingData, organization]);

  return <StepperComponent />;
};
