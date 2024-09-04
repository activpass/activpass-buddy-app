'use client';

import { Heading, Step, Stepper } from '@paalan/react-ui';
import { type FC, useEffect } from 'react';

import { ADD_CLIENT_STEPPER_COMPONENT, ADD_CLIENT_STEPS } from './constants';
import { useClientFormStore } from './store';

export const AddClientForm: FC = () => {
  const resetClientForm = useClientFormStore(state => state.resetClientForm);

  useEffect(() => {
    return () => {
      // reset the form when the component is unmounted
      resetClientForm();
    };
  }, [resetClientForm]);

  return (
    <Stepper
      steps={ADD_CLIENT_STEPS}
      initialStep={0}
      orientation="vertical"
      timeline
      timelineContainerClassName="gap-20"
      timelineContentClassName="bg-background py-6 px-8"
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
