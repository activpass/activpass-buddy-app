'use client';

import { Button, Input, Label, useToast } from '@paalan/react-ui';
import { type FC, type FormEventHandler } from 'react';

import Link from '@/components/Link';
import { useSession } from '@/stores/session-store';
import { api } from '@/trpc/client';

type SignInFormProps = {};
export const SignInForm: FC<SignInFormProps> = _props => {
  const session = useSession();
  const toast = useToast();

  const signInMutation = api.auth.signIn.useMutation({
    onSuccess(data) {
      if (!data) {
        toast.error('Failed to sign in');
        return;
      }
      session.update(data);
      toast.success('Signed in successfully');
    },
    onError(error) {
      toast.error(error.message || 'Failed to sign in');
      session.update(null);
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();
    const body = new FormData(event.currentTarget);
    const email = (body.get('email') || '').toString();
    const password = (body.get('password') || '').toString();

    signInMutation.mutate({ credentials: { email, password } });
  };

  const isLoading = signInMutation.isPending || session.status === 'loading';
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="m@activpass.in" />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
            Forgot your password?
          </Link>
        </div>
        <Input id="password" name="password" type="password" />
      </div>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};
