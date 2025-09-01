import type { FormFieldItem } from '@paalan/react-ui';
import { Button, Card, CardContent, Form, Heading, Text, VStack } from '@paalan/react-ui';
import { type FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type OnboardingProfileSetupSchema } from '@/validations/onboarding.validation';

import { ImageInput } from './ImageInput';

type OnboardingProfileSetupFormProps = {
  onSubmit: (data: OnboardingProfileSetupSchema) => void;
  form: UseFormReturn<OnboardingProfileSetupSchema>;
};

const getFormFields = (): FormFieldItem<OnboardingProfileSetupSchema>[] => [
  {
    type: 'input',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
    inputType: 'email',
    disabled: true,
    description: 'Email cannot be changed.',
  },
  {
    type: 'input',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
    required: true,
    inputProps: { autoFocus: true },
  },
  {
    type: 'input',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter your last name',
    required: true,
  },
  {
    type: 'number',
    name: 'phoneNumber',
    label: 'Mobile Number',
    placeholder: 'Enter a mobile number',
    required: true,
    numberInputProps: {
      zeroAsEmptyString: true,
      maxLength: 10,
    },
  },
  {
    type: 'custom',
    name: 'picture',
    label: 'Profile Picture',
    render: ({ field }) => <ImageInput field={field} />,
  },
];

export const OnboardingProfileSetupForm: FC<OnboardingProfileSetupFormProps> = ({
  onSubmit,
  form,
}) => {
  const handleSubmit = (data: OnboardingProfileSetupSchema) => {
    onSubmit(data);
  };

  const formFields = getFormFields();

  return (
    <Card className="relative min-h-[532px] border-b border-border shadow-lg">
      <CardContent className="p-6">
        <VStack gap="8">
          {/* Header */}
          <VStack gap="2">
            <Heading as="h2" className="text-lg font-semibold text-foreground">
              Onboarding Step 1 - Profile Setup
            </Heading>
            <Text className="text-sm text-muted-foreground">
              Please add your personal information.
            </Text>
          </VStack>

          {/* Form */}
          <Form<OnboardingProfileSetupSchema>
            form={form}
            onSubmit={handleSubmit}
            hideResetButton
            hideSubmitButton
            fields={formFields}
            inline
          >
            {/* Footer Actions */}
            <div className="flex justify-end">
              <Button type="submit" className="h-9 px-4">
                Next
              </Button>
            </div>
          </Form>
        </VStack>
      </CardContent>
    </Card>
  );
};
