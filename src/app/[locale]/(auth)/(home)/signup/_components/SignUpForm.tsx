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
    formItemClassName: 'col-span-2',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'input',
    inputType: 'password',
    placeholder: 'Enter your password',
    formItemClassName: 'col-span-2',
    required: true,
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'input',
    inputType: 'password',
    placeholder: 'Enter your password again',
    formItemClassName: 'col-span-2',
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
        'Account was created successfully, please wait while we redirect you to the next step.',
        {
          duration: 6000,
        }
      );
      startTransition(() => {
        router.push(`/onboarding-step?userId=${user.id}`);
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
      submitText="Sign Up"
      actionClassName="col-span-2"
      submitClassName="w-full"
      className="grid grid-cols-2 gap-4 space-y-0"
    />
  );
};
