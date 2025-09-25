'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { dateIntl, numberIntl } from '@paalan/react-shared/lib';
import { Box, Form, Heading, Stack, Text, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/trpc/client';
import {
  type EmployeeFormSchema,
  employeeFormSchema,
} from '@/validations/employee/add-form.validation';

import type { EmployeeData } from '../../../types';
import { BankDetailsForm } from './_components/BankDetailsForm';
import { EmergencyContact } from './_components/EmergencyContact';
import { EmployeeInfo } from './_components/EmployeeInfo';
import { JobDetailsForm } from './_components/JobDetailsForm';

type ProfileFormProps = {
  data: EmployeeData;
};

export const ProfileForm: FC<ProfileFormProps> = ({ data }) => {
  const { emergencyContact, payroll, workSchedule, jobDetails } = data;

  const personalInformation = {
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phoneNumber: data.phoneNumber || undefined,
    address: data.address || undefined,
    dob: data.dob || undefined,
    gender: data.gender || undefined,
  };

  const { id } = useParams<{ id: string }>();

  const form = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      ...personalInformation,
      dob: dateIntl.formatDate(personalInformation.dob, {
        dateFormat: 'yyyy-MM-dd',
      }),
      emergencyContact: {
        ...emergencyContact,
        name: emergencyContact?.name || undefined,
        phoneNumber: emergencyContact?.phoneNumber || undefined,
        gender: emergencyContact?.gender || undefined,
        relationship: emergencyContact?.relationship || undefined,
      },
      jobDetails: {
        ...jobDetails,
        title: jobDetails?.title || undefined,
        description: jobDetails?.description || undefined,
        department: jobDetails?.department || undefined,
      },
      payroll: {
        ...payroll,
        grossSalary: payroll?.grossSalary ? numberIntl.format(payroll.grossSalary) : '',
        dateOfSalary: dateIntl.formatDate(payroll?.dateOfSalary, 'yyyy-MM-dd'),
      },
      workSchedule: {
        ...workSchedule,
        shiftStartTime: workSchedule?.shiftStartTime || undefined,
        shiftEndTime: workSchedule?.shiftEndTime || undefined,
        workDays: workSchedule?.workDays || undefined,
        breakHours: workSchedule?.breakHours || 0,
        entitledHolidays: workSchedule?.entitledHolidays || 0,
      },
      bank: {
        ...data.bank,
        name: data.bank?.name || undefined,
        accountNumber: data.bank?.accountNumber || undefined,
        ifscCode: data.bank?.ifscCode || undefined,
        branchName: data.bank?.branchName || undefined,
        accountHolderName: data.bank?.accountHolderName || undefined,
      },
    },
    mode: 'onChange',
  });

  const updateProfile = api.employees.update.useMutation({
    onSuccess: () => {
      toast.success('Personal Information updated successfully!');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onSubmit = (updateData: EmployeeFormSchema) => {
    updateProfile.mutate({
      id,
      data: {
        ...updateData,
        dob: new Date(updateData.dob),
        payroll: {
          ...updateData.payroll,
          dateOfSalary: updateData.payroll.dateOfSalary
            ? new Date(updateData.payroll.dateOfSalary)
            : undefined,
          grossSalary: updateData.payroll.grossSalary.replace(/,/g, ''),
        },
      },
    });
  };

  return (
    <Form<EmployeeFormSchema>
      form={form}
      onSubmit={onSubmit}
      submitText={updateProfile.isPending ? 'Updating...' : 'Update Profile Info'}
      isSubmitting={updateProfile.isPending}
      actionClassName="justify-start"
      fields={[]}
      hideResetButton
      className="flex flex-col gap-6"
    >
      <Stack gap="6">
        <EmployeeInfo form={form} />
        {emergencyContact && <EmergencyContact form={form} />}
      </Stack>

      <Stack gap="4">
        <Box>
          <Heading as="h3">Job Details</Heading>
          <Text fontSize="sm" className="text-muted-foreground">
            Details of your job details can be viewed here.
          </Text>
        </Box>
        <JobDetailsForm form={form} />
      </Stack>

      <Stack gap="4">
        <Box>
          <Heading as="h3">Bank Details</Heading>
          <Text fontSize="sm" className="text-muted-foreground">
            Details of your bank details can be viewed here.
          </Text>
        </Box>
        <BankDetailsForm form={form} />
      </Stack>
    </Form>
  );
};
