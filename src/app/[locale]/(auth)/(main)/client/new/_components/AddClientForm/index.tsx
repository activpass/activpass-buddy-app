'use client';

import { ArrowBackIcon, ArrowForwardIcon, PlusCircledIcon } from '@paalan/react-icons';
import { Button, Heading, Step, Stepper, useStepper } from '@paalan/react-ui';
import type { FC } from 'react';

import { ADD_CLIENT_STEPS } from '../constants';

const StepperFooter: FC = () => {
  const { nextStep, prevStep, resetSteps, isDisabledStep, hasCompletedAllSteps, isLastStep } =
    useStepper();

  return (
    <>
      {hasCompletedAllSteps && (
        <div className="my-2 flex h-40 items-center justify-center break-normal rounded-md border bg-secondary text-foreground">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="flex w-full justify-between gap-2">
        {hasCompletedAllSteps ? (
          <Button onClick={resetSteps}>Reset</Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              variant="outline"
              leftIcon={<ArrowBackIcon boxSize="4" />}
            >
              Back
            </Button>
            {isLastStep ? (
              <Button onClick={nextStep} leftIcon={<PlusCircledIcon boxSize="4" />}>
                Submit
              </Button>
            ) : (
              <Button onClick={nextStep} rightIcon={<ArrowForwardIcon boxSize="4" />}>
                Next
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export const AddClientForm: FC = () => {
  return (
    <Stepper
      steps={ADD_CLIENT_STEPS}
      initialStep={0}
      orientation="vertical"
      timeline
      timelineContainerClassName="gap-20"
    >
      {ADD_CLIENT_STEPS.map((stepProps, index) => {
        return (
          <Step key={stepProps.label} {...stepProps}>
            <div className="my-2 flex h-40 items-center justify-center rounded-md border bg-secondary text-foreground">
              <Heading as="h2" className="text-xl">
                Step {index + 1}
              </Heading>
            </div>
          </Step>
        );
      })}
      <StepperFooter />
    </Stepper>
  );
};
