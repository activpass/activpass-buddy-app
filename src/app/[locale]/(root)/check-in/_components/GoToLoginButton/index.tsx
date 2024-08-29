'use client';

import { Button } from '@paalan/react-ui';
import type { FC } from 'react';
import { LuArrowRight } from 'react-icons/lu';

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
      rightIcon={<LuArrowRight className="size-4" />}
    >
      Go to Login
    </Button>
  );
};
