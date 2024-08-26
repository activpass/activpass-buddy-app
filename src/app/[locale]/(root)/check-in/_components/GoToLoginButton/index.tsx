'use client';

import { Button } from '@paalan/react-ui';
import { ArrowRightIcon } from 'lucide-react';
import type { FC } from 'react';

import { useRouter } from '@/lib/navigation';

type GoToLoginButtonProps = {
  className?: string;
};
export const GoToLoginButton: FC<GoToLoginButtonProps> = ({ className }) => {
  const router = useRouter();
  const onClick = () => {
    router.push('/signin');
  };
  return (
    <Button
      className={className}
      variant="outline"
      onClick={onClick}
      size="sm"
      rightIcon={<ArrowRightIcon className="size-4" />}
    >
      Go to Login
    </Button>
  );
};
