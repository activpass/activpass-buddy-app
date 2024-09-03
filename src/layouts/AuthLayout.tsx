import type { FC, PropsWithChildren } from 'react';

import { WithBreadcrumb } from '@/components/Hoc/WithBreadcrumb';
import { BreadcrumbProvider } from '@/providers/BreadcrumbProvider';

import { WithHeader } from '../components/Hoc/WithHeader';

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <WithHeader />
    <BreadcrumbProvider>
      <main className="h-[calc(100dvh-72px)]">
        <WithBreadcrumb />
        <div className="h-[calc(100%-64px)] overflow-auto p-4 md:p-8">{children}</div>
      </main>
    </BreadcrumbProvider>
  </>
);
