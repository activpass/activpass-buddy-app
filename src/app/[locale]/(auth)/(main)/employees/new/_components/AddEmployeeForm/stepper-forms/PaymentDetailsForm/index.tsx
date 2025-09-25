'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, toast } from '@paalan/react-ui';
import { type FC, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';
import { WorkdaysEnum } from '@/validations/employee/add-form.validation';

import { useEmployeeFormStore } from '../../store';
import { StepperFormActions } from '../StepperFormActions';
import { fields, type PaymentDetailsFormData, paymentDetailsSchema } from './fields';

export const PaymentDetailsForm: FC = () => {
  const router = useRouter();

  const onboardingData = useEmployeeFormStore(state => state.onboardingData);
  const token = onboardingData?.token || null;

  const paymentDetails = useEmployeeFormStore(state => state.paymentDetails);
  const setPaymentDetails = useEmployeeFormStore(state => state.setPaymentDetails);
  const employeeFormState = useEmployeeFormStore(state => state);

  const [isPending, startTransition] = useTransition();
  const createEmployeeMutation = api.employees.create.useMutation({
    onSuccess: () => {
      toast.success('Employee added successfully');
      startTransition(() => {
        router.push('/employees');
      });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Failed to add employee');
    },
  });
  const completeOnboardingMutation = api.onboardEmployee.complete.useMutation({
    onSuccess: () => {
      toast.success('Employee onboarding completed successfully!');
      startTransition(() => {
        router.replace('/onboard/employee/success');
      });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Failed to complete onboarding');
    },
  });

  const form = useForm<PaymentDetailsFormData>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: paymentDetails,
  });

  const onSubmit = async (data: PaymentDetailsFormData) => {
    setPaymentDetails(data);
    const { jobDetails } = employeeFormState;
    const { workSchedule, salary, ...restJobDetails } = jobDetails;
    // Convert form data to the format expected by the API
    const employeeData = {
      ...employeeFormState.personalInformation,
      dob: employeeFormState.personalInformation.dob || new Date(),
      // Bank details
      bank: data.bank,

      // Job details
      jobDetails: restJobDetails,

      // Work schedule - placeholder data
      workSchedule: {
        workDays: Object.values(WorkdaysEnum.enum),
        shiftStartTime: workSchedule.shiftStartTime,
        shiftEndTime: workSchedule.shiftStartTime,
        breakHours: workSchedule.breakHours,
        entitledHolidays: workSchedule.entitledHolidays,
      },

      // Payroll
      payroll: {
        grossSalary: salary.replace(/,/g, ''),
        dateOfSalary: new Date(data.dateOfSalary),
        benefits: [],
        compensation: [],
      },
    };

    if (token) {
      // Complete the onboarding
      completeOnboardingMutation.mutate({
        token,
        employeeData,
      });
    } else {
      createEmployeeMutation.mutate(employeeData);
    }
  };

  const isSubmitting = createEmployeeMutation.isPending || completeOnboardingMutation.isPending;
  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      fields={fields}
      hideResetButton
      hideSubmitButton
      className="grid grid-cols-2 gap-4 space-y-0"
    >
      <StepperFormActions isSubmitting={isSubmitting || isPending} />
    </Form>
  );
};
