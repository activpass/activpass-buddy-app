import type { FormFieldItem } from '@paalan/react-ui';
import { Button, Card, CardContent, Form, Heading, Text, VStack } from '@paalan/react-ui';
import { type FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import {
  getBusinessTypeOptions,
  type OnboardingFacilitySetupSchema,
} from '@/validations/onboarding.validation';

import { ImageInput } from './ImageInput';

type OnboardingFacilitySetupFormProps = {
  onSubmit: (data: OnboardingFacilitySetupSchema) => void;
  onBack: () => void;
  isSubmitting: boolean;
  form: UseFormReturn<OnboardingFacilitySetupSchema>;
};

const getFormFields = (): FormFieldItem<OnboardingFacilitySetupSchema>[] => [
  {
    type: 'input',
    name: 'facilityName',
    label: 'Facility Name',
    placeholder: 'Enter your facility name',
    required: true,
    inputProps: { autoFocus: true },
  },
  {
    type: 'select',
    name: 'businessType',
    label: 'Business Type',
    placeholder: 'Select business type',
    required: true,
    options: getBusinessTypeOptions(),
  },
  {
    type: 'custom',
    name: 'logo',
    label: 'Business Logo',
    render: ({ field }) => <ImageInput field={field} />,
  },
  {
    type: 'input',
    name: 'address',
    label: 'Address',
    placeholder: 'Enter your address',
    required: true,
  },
  {
    type: 'input',
    name: 'city',
    label: 'City',
    placeholder: 'Enter your city',
    required: true,
  },
  {
    type: 'input',
    name: 'pincode',
    label: 'Pincode',
    placeholder: 'Enter your pincode',
    required: true,
    inputProps: {
      maxLength: 6,
    },
  },
];

export const OnboardingFacilitySetupForm: FC<OnboardingFacilitySetupFormProps> = ({
  onSubmit,
  onBack,
  form,
  isSubmitting,
}) => {
  const formFields = getFormFields();

  return (
    <Card className="relative border-b border-border shadow-lg">
      <CardContent className="p-6">
        <VStack gap="8">
          {/* Header */}
          <VStack gap="2">
            <Heading as="h2" className="text-lg font-semibold text-foreground">
              Onboarding Step 2 - Facility Setup
            </Heading>
            <Text className="text-sm text-muted-foreground">
              Please add your facility information.
            </Text>
          </VStack>

          {/* Form */}
          <Form<OnboardingFacilitySetupSchema>
            form={form}
            onSubmit={onSubmit}
            hideResetButton
            hideSubmitButton
            fields={formFields}
            inline
          >
            {/* Footer Actions */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </Form>
        </VStack>
      </CardContent>
    </Card>
  );
};
