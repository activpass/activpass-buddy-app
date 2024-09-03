'use client';

import { Button } from '@paalan/react-ui';
import type { FC } from 'react';
import { LuArrowRight } from 'react-icons/lu';

import Link from '@/components/Link';

type GoToLoginButtonProps = {
  className?: string;
};
export const GoToLoginButton: FC<GoToLoginButtonProps> = ({ className }) => {
  return (
    <Button
      className={className}
      variant="outline"
      as={Link}
      href="/signin"
      size="sm"
      rightIcon={<LuArrowRight className="size-4" />}
    >
      Go to Login
    </Button>
  );
};
