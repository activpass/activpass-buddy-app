'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { dateIntl } from '@paalan/react-shared/lib';
import { Form, Stack, toast } from '@paalan/react-ui';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { ProfileHeader } from '@/components/Common/ProfileHeader';
import { uploadToImagekit } from '@/lib/imagekit';
import { api } from '@/trpc/client';
import { type UserFormSchema, userFormSchema } from '@/validations/user/add-form.validation';

import type { GetPopulatedUserData } from '../../../types';
import { CompanyDetailsForm } from './CompanyDetailsForm';
import { UserInfoForm } from './UserInfoForm';

type ProfileFormProps = {
  data: GetPopulatedUserData;
  logoFile?: File | null;
};

export const ProfileForm: FC<ProfileFormProps> = ({ data, logoFile }) => {
  const { organization } = data;

  const personalInformation = {
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phoneNumber: data.phoneNumber || undefined,
    address: data.address || undefined,
    dob: data.dob || undefined,
    gender: data.gender || undefined,
  };

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      ...personalInformation,
      dob: personalInformation.dob
        ? dateIntl.formatDate(personalInformation.dob, {
            dateFormat: 'yyyy-MM-dd',
          })
        : '',
      organization: {
        id: organization?.id || undefined,
        name: organization?.name || '',
        type: organization?.type || undefined,
        logo: logoFile || undefined,
        address: organization?.address || undefined,
        city: organization?.city || undefined,
        pincode: organization?.pincode || undefined,
      },
    },
    mode: 'onChange',
  });

  const updateProfile = api.users.update.useMutation({
    onSuccess: () => {
      toast.success('Personal Information updated successfully!');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (updateData: UserFormSchema) => {
    const { logo } = updateData.organization;
    let logoImageKitResponse;

    if (logo && logo.name === logoFile?.name) {
      // If the logo hasn't changed, use the existing URL
      logoImageKitResponse = organization.logo as typeof logoImageKitResponse;
    } else if (logo instanceof File && logo.size > 0) {
      logoImageKitResponse = await uploadToImagekit({
        file: logo,
        fileName: `logo_${organization?.name || 'org'}_${Date.now()}`,
      });
    }

    updateProfile.mutate({
      id: data.id,
      data: {
        ...updateData,
        dob: new Date(updateData.dob),
        organization: {
          ...updateData.organization,
          logo: logoImageKitResponse || null,
        },
      },
    });
  };

  return (
    <Form<UserFormSchema>
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
        <UserInfoForm form={form} />
      </Stack>

      <Stack gap="4">
        <ProfileHeader
          title="Company Details"
          description=" Details of your company can be viewed and edited here"
          showActionButton={false}
        />
        <CompanyDetailsForm form={form} />
      </Stack>
    </Form>
  );
};
