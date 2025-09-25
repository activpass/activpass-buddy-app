'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@paalan/react-ui';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';

import { useEmployeeFormStore } from '../../store';
import { StepperFormActions } from '../StepperFormActions';
import { getJobDetailsFields, type JobDetailsFormData, jobDetailsFormSchema } from './fields';

export const JobDetailsForm: FC = () => {
  const jobDetails = useEmployeeFormStore(state => state.jobDetails);
  const setJobDetails = useEmployeeFormStore(state => state.setJobDetails);
  const nextStep = useEmployeeFormStore(state => state.nextStep);

  const form = useForm<JobDetailsFormData>({
    resolver: zodResolver(jobDetailsFormSchema),
    defaultValues: jobDetails,
    mode: 'onChange',
  });

  const onSubmit = (data: JobDetailsFormData) => {
    setJobDetails(data);
    nextStep();
  };

  const fields = getJobDetailsFields(form);

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      fields={fields}
      hideSubmitButton
      hideResetButton
      className="grid grid-cols-2 gap-4 space-y-0"
    >
      <StepperFormActions />
    </Form>
  );
};
