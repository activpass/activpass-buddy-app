'use client';

import { Heading, Step, Stepper } from '@paalan/react-ui';
import type { FC } from 'react';

import { ADD_CLIENT_STEPPER_COMPONENT, ADD_CLIENT_STEPS } from './constants';

export const AddClientForm: FC = () => {
  return (
    <Stepper
      steps={ADD_CLIENT_STEPS}
      initialStep={0}
      orientation="vertical"
      timeline
      timelineContainerClassName="gap-20"
      timelineContentClassName="bg-background py-6 px-8"
      styles={{
        'vertical-step-content': 'bg-background py-4',
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
