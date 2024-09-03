import { ArrowBackIcon, ArrowForwardIcon, PlusCircledIcon } from '@paalan/react-icons';
import { cn } from '@paalan/react-shared/lib';
import { Button, useStepper } from '@paalan/react-ui';
import type { FC } from 'react';

type StepperFormActionsProps = {
  className?: string;
  isSubmitting?: boolean;
};
export const StepperFormActions: FC<StepperFormActionsProps> = ({ className, isSubmitting }) => {
  const { prevStep, isDisabledStep, isLastStep } = useStepper();

  return (
    <div className={cn('flex w-full justify-between gap-2 pt-4', className)}>
      <Button
        disabled={isDisabledStep || isSubmitting}
        onClick={prevStep}
        variant="outline"
        leftIcon={<ArrowBackIcon boxSize="4" />}
      >
        Back
      </Button>
      {isLastStep ? (
        <Button
          type="submit"
          leftIcon={<PlusCircledIcon boxSize="4" />}
          color="green"
          isLoading={isSubmitting}
          loadingText="Submitting"
        >
          Submit
        </Button>
      ) : (
        <Button type="submit" rightIcon={<ArrowForwardIcon boxSize="4" />}>
          Next
        </Button>
      )}
    </div>
  );
};
