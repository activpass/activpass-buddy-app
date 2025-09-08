import { ArrowBackIcon, ArrowForwardIcon, PlusCircledIcon } from '@paalan/react-icons';
import { cn } from '@paalan/react-shared/lib';
import { Button } from '@paalan/react-ui';
import type { FC } from 'react';

import { ADD_CLIENT_STEP_ID } from '../../constants';
import { useClientFormStore } from '../../store';

type StepperFormActionsProps = {
  className?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
};
export const StepperFormActions: FC<StepperFormActionsProps> = ({
  className,
  isSubmitting,
  disabled,
}) => {
  const currentStep = useClientFormStore(state => state.currentStep);
  const prevStep = useClientFormStore(state => state.prevStep);

  const isLastStep = currentStep === ADD_CLIENT_STEP_ID.PAYMENT_DETAILS;
  const isDisabledStep = currentStep === ADD_CLIENT_STEP_ID.CLIENT_INFORMATION;

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
          isLoading={isSubmitting}
          loadingText="Submitting"
          disabled={disabled || isSubmitting}
        >
          Submit
        </Button>
      ) : (
        <Button type="submit" rightIcon={<ArrowForwardIcon boxSize="4" />} disabled={disabled}>
          Next
        </Button>
      )}
    </div>
  );
};
