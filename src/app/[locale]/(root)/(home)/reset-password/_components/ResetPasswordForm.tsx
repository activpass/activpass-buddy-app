'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, useToast } from '@paalan/react-ui';
import { useTranslations } from 'next-intl';
import { type FC, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';
import {
  resetPasswordValidationSchema,
  type ResetPasswordValidationSchemaType,
} from '@/validations/auth.validation';

type ResetPasswordFormProps = {
  token: string;
  email: string;
};
export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ token, email }) => {
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations('ResetPassword');
  const [isPending, startTransition] = useTransition();

  const resetPasswordMutation = api.auth.resetPassword.useMutation({
    onSuccess() {
      toast.success(t('success_message'));
      startTransition(() => {
        router.push('/signin');
      });
    },
    onError(error) {
      toast.error(error.message || t('error_message'));
    },
  });

  const form = useForm({
    resolver: zodResolver(resetPasswordValidationSchema),
    defaultValues: {
      email,
      password: '',
      confirmPassword: '',
    },
  });

  const formFields: FormFieldItem<ResetPasswordValidationSchemaType>[] = [
    {
      type: 'input',
      name: 'email',
      label: t('email_label'),
      placeholder: t('email_placeholder'),
      required: true,
      inputType: 'email',
      disabled: true,
      description: 'Email cannot be changed.',
    },
    {
      type: 'input',
      name: 'password',
      label: t('new_password_label'),
      placeholder: t('new_password_placeholder'),
      required: true,
      inputType: 'password',
      inputProps: { autoFocus: true },
    },
    {
      type: 'input',
      name: 'confirmPassword',
      label: t('confirm_password_label'),
      placeholder: t('confirm_password_placeholder'),
      required: true,
      inputType: 'password',
    },
  ];

  const handleSubmit = async (values: ResetPasswordValidationSchemaType) => {
    if (!token) {
      toast.error(t('token_missing_message'));
      return;
    }
    resetPasswordMutation.mutate({ ...values, passwordToken: token });
  };

  const isLoading = resetPasswordMutation.isPending || isPending;

  return (
    <Form<ResetPasswordValidationSchemaType>
      form={form}
      fields={formFields}
      onSubmit={handleSubmit}
      hideResetButton
      isSubmitting={isLoading}
      submitText={isLoading ? t('submitting_button') : t('submit_button')}
      submitClassName="w-full"
    />
  );
};
