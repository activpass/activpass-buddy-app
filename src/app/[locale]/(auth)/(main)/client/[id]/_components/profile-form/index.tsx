'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { dateIntl } from '@paalan/react-shared/lib';
import { Box, Form, Heading, Stack, Text, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/trpc/client';
import type { RouterOutputs } from '@/trpc/shared';

import { ClientInfo } from './_components/ClientInfo';
import { EmergencyContact } from './_components/EmergencyContact';
import { HealthFitness } from './_components/HealthFitness';
import { type ClientProfileFormSchema, clientProfileFormSchema } from './schema';

type ProfileFormProps = {
  clientData: RouterOutputs['clients']['get'];
};

export const ProfileForm: FC<ProfileFormProps> = ({ clientData }) => {
  const { emergencyContact, healthAndFitness } = clientData;
  const personalInformation = {
    firstName: clientData.firstName,
    lastName: clientData.lastName,
    email: clientData.email,
    phoneNumber: clientData.phoneNumber,
    address: clientData.address,
    dob: clientData.dob,
    gender: clientData.gender,
  };

  const { id } = useParams<{ id: string }>();

  const form = useForm<ClientProfileFormSchema>({
    resolver: zodResolver(clientProfileFormSchema),
    defaultValues: {
      personalInformation: {
        ...personalInformation,
        dob: dateIntl.formatDate(personalInformation.dob, {
          dateFormat: 'yyyy-MM-dd',
        }),
      },
      emergencyContact: { ...emergencyContact },
      healthAndFitness: { ...healthAndFitness },
    },
    mode: 'onChange',
  });

  const updateProfile = api.clients.update.useMutation({
    onSuccess: () => {
      toast.success('Personal Information updated successfully!');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onSubmit = (updateData: ClientProfileFormSchema) => {
    updateProfile.mutate({
      id,
      data: {
        ...updateData,
        personalInformation: {
          ...updateData.personalInformation,
          dob: new Date(updateData.personalInformation.dob),
        },
      },
    });
  };

  return (
    <Form<ClientProfileFormSchema>
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
        <ClientInfo form={form} />
        {emergencyContact && <EmergencyContact form={form} />}
      </Stack>

      <Stack gap="4">
        <Box>
          <Heading as="h3">Fitness Goals</Heading>
          <Text fontSize="sm" className="text-muted-foreground">
            Details of your client can be viewed here
          </Text>
        </Box>
        {healthAndFitness && <HealthFitness form={form} />}
      </Stack>
    </Form>
  );
};
