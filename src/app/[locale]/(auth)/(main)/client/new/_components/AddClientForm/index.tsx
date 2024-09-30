'use client';

import { cn } from '@paalan/react-shared/lib';
import { Heading, Step, Stepper } from '@paalan/react-ui';
import { type FC, useEffect } from 'react';

import type { MembershipPlan } from '../../../membership/types';
import { ADD_CLIENT_STEPPER_COMPONENT, ADD_CLIENT_STEPS } from './constants';
import { useClientFormStore } from './store';

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

  return (
    <Stepper
      steps={ADD_CLIENT_STEPS}
      initialStep={0}
      orientation="vertical"
      timeline
      timelineContainerClassName="gap-20"
      timelineContentClassName={cn('bg-background py-6 px-8', {
        'pt-0': !!onboardClientId,
      })}
      styles={{
        'vertical-step-content': 'py-4',
      }}
    >
      {ADD_CLIENT_STEPS.map(stepProps => {
        const StepComponent = ADD_CLIENT_STEPPER_COMPONENT[stepProps.id];
        return (
          <Step key={stepProps.label} {...stepProps}>
            <Heading as="h2" className="mb-4">
              {stepProps.label}
            </Heading>
            <StepComponent />
          </Step>
        );
      })}
    </Stepper>
  );
};
