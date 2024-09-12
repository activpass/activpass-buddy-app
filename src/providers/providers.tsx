import type { PropsWithChildren } from 'react';

import { TRPCReactProvider } from '@/trpc/client';

import { LocaleProvider } from './LocaleProvider';
import { ThemeProvider } from './ThemeProvider';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <LocaleProvider>
      <TRPCReactProvider>
        <ThemeProvider attribute="class" defaultTheme="white">
          {children}
        </ThemeProvider>
      </TRPCReactProvider>
    </LocaleProvider>
  );
};
