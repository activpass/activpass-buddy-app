'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useCopyToClipboard } from '@/hooks';
import { api } from '@/trpc/client';
import {
  forgotPasswordValidationSchema,
  type ForgotPasswordValidationSchemaType,
} from '@/validations/auth.validation';

const formFields: FormFieldItem<ForgotPasswordValidationSchemaType>[] = [
  {
    type: 'input',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your registered email',
    required: true,
    inputType: 'email',
    inputProps: { autoFocus: true },
  },
];

export const ForgotPasswordForm: FC = () => {
  const form = useForm({
    resolver: zodResolver(forgotPasswordValidationSchema),
    defaultValues: {
      email: '',
    },
  });
  const [copied, setTextCopy] = useCopyToClipboard();

  useEffect(() => {
    if (copied) {
      toast.success('Reset password link copied to clipboard');
    }
  }, [copied]);

  const forgotPasswordMutation = api.auth.forgotPassword.useMutation({
    onSuccess(data) {
      if (!data.success) {
        toast.error('Failed to send verification email');
        return;
      }
      setTextCopy(data.url);
      // toast.success('Verification email sent successfully, please check your inbox.');
    },
    onError(error) {
      toast.error(error.message || 'Failed to send verification email');
    },
  });

  const handleSubmit = (values: ForgotPasswordValidationSchemaType) => {
    forgotPasswordMutation.mutate(values);
  };

  const isLoading = forgotPasswordMutation.isPending;
  return (
    <Form<ForgotPasswordValidationSchemaType>
      form={form}
      fields={formFields}
      onSubmit={handleSubmit}
      hideResetButton
      isSubmitting={isLoading}
      submitText={isLoading ? 'Sending...' : 'Send Reset Link'}
      submitClassName="w-full"
    />
  );
};
