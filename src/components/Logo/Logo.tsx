'use client';

import { useNextTheme } from '@paalan/react-providers/NextThemeProvider';
import { cn } from '@paalan/react-shared/lib';
import Image from 'next/image';
import type { FC } from 'react';

import blackLogo from '@/public/logos/png/activpass-buddy-logo-black-blue.png';
import whiteLogo from '@/public/logos/png/activpass-buddy-logo-white-blue.png';

import Link from '../Link';

type LogoProps = {
  className?: string;
};
export const Logo: FC<LogoProps> = ({ className }) => {
  const { isDark } = useNextTheme();

  return (
    <Link href="/">
      <Image
        src={isDark ? whiteLogo : blackLogo}
        alt="Activpass"
        width="140"
        height="25"
        className={cn('h-auto w-36', className)}
        priority
      />
      <span className="sr-only">Activpass Logo</span>
    </Link>
  );
};
