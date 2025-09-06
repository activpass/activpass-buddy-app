'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, useToast } from '@paalan/react-ui';
import { type FC, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { UserProviderEnum } from '@/enums/user.enum';
import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';
import {
  signUpValidationSchema,
  type SignUpValidationSchemaType,
} from '@/validations/auth.validation';

const fields: FormFieldItem<SignUpValidationSchemaType>[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'input',
    inputType: 'email',
    placeholder: 'Enter your email',
    required: true,
    inputProps: { autoFocus: true },
  },
  {
    name: 'password',
    label: 'Password',
    type: 'input',
    inputType: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'input',
    inputType: 'password',
    placeholder: 'Enter your password again',
    required: true,
  },
];

export const SignUpForm: FC = () => {
  const toast = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const signUpMutation = api.auth.signUp.useMutation({
    onSuccess: user => {
      toast.success(
        'Account created successfully! Please check your email to verify your account.'
      );
      startTransition(() => {
        router.push(`/signup/success?email=${encodeURIComponent(user.email)}`);
      });
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const form = useForm<SignUpValidationSchemaType>({
    resolver: zodResolver(signUpValidationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      provider: UserProviderEnum.email,
    },
  });

  const onSubmitHandle = async (values: SignUpValidationSchemaType) => {
    signUpMutation.mutate(values);
  };

  return (
    <Form<SignUpValidationSchemaType>
      fields={fields}
      form={form}
      isSubmitting={isPending || signUpMutation.isPending}
      onSubmit={onSubmitHandle}
      hideResetButton
      submitText="Register"
      submitClassName="w-full"
    />
  );
};
