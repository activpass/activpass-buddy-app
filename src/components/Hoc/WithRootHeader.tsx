import type { FC } from 'react';

import ThemeToggle from '@/components/Common/ThemeToggle';
import { Logo } from '@/components/Logo';

export const WithRootHeader: FC = () => {
  return (
    <header className="sticky top-0 z-50 flex h-[4.5rem] items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex flex-1 items-center justify-between gap-5 text-lg font-medium">
        <Logo />
        <ThemeToggle />
      </nav>
    </header>
  );
};
