'use client';

import { cn } from '@paalan/react-shared/lib';
import { Box, HStack, Strong, Text, VStack } from '@paalan/react-ui';
import { createElement, type FC, type FunctionComponent, useEffect, useMemo } from 'react';

import { ADD_EMPLOYEE_STEP_ID, ADD_EMPLOYEE_STEPS } from './constants';
import { JobDetailsForm } from './stepper-forms/JobDetailsForm';
import { PaymentDetailsForm } from './stepper-forms/PaymentDetailsForm';
import { PersonalInformationForm } from './stepper-forms/PersonalInformationForm';
import { useEmployeeFormStore } from './store';

export const ADD_EMPLOYEE_STEPPER_COMPONENT: Record<
  keyof typeof ADD_EMPLOYEE_STEP_ID,
  FunctionComponent
> = {
  [ADD_EMPLOYEE_STEP_ID.PERSONAL_INFORMATION]: PersonalInformationForm,
  [ADD_EMPLOYEE_STEP_ID.JOB_DETAILS]: JobDetailsForm,
  [ADD_EMPLOYEE_STEP_ID.PAYMENT_DETAILS]: PaymentDetailsForm,
};

const StepperComponent = () => {
  const currentStep = useEmployeeFormStore(state => state.currentStep);

  const currentDescription = useMemo(() => {
    return ADD_EMPLOYEE_STEPS.find(tab => tab.id === currentStep)?.description;
  }, [currentStep]);

  return (
    <VStack justifyContent="center">
      <HStack justifyContent="center" mb="2">
        {ADD_EMPLOYEE_STEPS.map(({ label, id }) => (
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
      {createElement(ADD_EMPLOYEE_STEPPER_COMPONENT[currentStep])}
    </VStack>
  );
};

type AddEmployeeFormProps = {
  token?: string;
  organization?: {
    name: string;
    type: string;
    id: string;
  };
};

export const AddEmployeeForm: FC<AddEmployeeFormProps> = ({ organization, token }) => {
  const resetEmployeeForm = useEmployeeFormStore(state => state.resetEmployeeForm);
  const setOnboardingData = useEmployeeFormStore(state => state.setOnboardingData);

  useEffect(() => {
    return () => {
      // reset the form when the component is unmounted
      resetEmployeeForm();
    };
  }, [resetEmployeeForm]);

  /**
   * Set the onboarding data to the store
   */
  useEffect(() => {
    setOnboardingData({ token, organization });
  }, [token, setOnboardingData, organization]);

  return <StepperComponent />;
};
