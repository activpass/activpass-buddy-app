'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormFieldItems, Grid, VStack } from '@paalan/react-ui';
import { startOfDay } from 'date-fns';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';

import {
  type PersonalInformationFormSchema,
  personalInformationFormSchema,
} from '@/validations/employee/add-form.validation';

import { useEmployeeFormStore } from '../../store';
import { StepperFormActions } from '../StepperFormActions';
import { getEmergencyContactFields, getPersonalInfoFields } from './fields';

export const PersonalInformationForm: FC = () => {
  const personalInformation = useEmployeeFormStore(state => state.personalInformation);
  const setPersonalInformation = useEmployeeFormStore(state => state.setPersonalInformation);
  const nextStep = useEmployeeFormStore(state => state.nextStep);

  const form = useForm<PersonalInformationFormSchema>({
    resolver: zodResolver(personalInformationFormSchema),
    defaultValues: personalInformation,
  });

  const onSubmit = (data: PersonalInformationFormSchema) => {
    setPersonalInformation({
      ...data,
      dob: startOfDay(data.dob ? new Date(data.dob) : new Date()),
    });
    nextStep();
  };

  return (
    <Form<PersonalInformationFormSchema>
      form={form}
      onSubmit={onSubmit}
      hideResetButton
      hideSubmitButton
      fields={[]}
      className="space-y-0"
    >
      <VStack gap="12">
        <Grid className="mt-5 grid-cols-1 gap-5 sm:grid-cols-2">
          <FormFieldItems<PersonalInformationFormSchema>
            fields={getPersonalInfoFields(form)}
            control={form.control}
          />
        </Grid>
        <Grid className="grid-cols-1 gap-5 sm:grid-cols-2">
          <FormFieldItems<PersonalInformationFormSchema>
            fields={getEmergencyContactFields(form)}
            control={form.control}
          />
        </Grid>
      </VStack>
      <StepperFormActions />
    </Form>
  );
};
