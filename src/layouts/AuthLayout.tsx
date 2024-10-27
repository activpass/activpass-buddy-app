import type { FC, PropsWithChildren } from 'react';

import { AuthGuard } from '@/components/Auth/AuthGuard';
import { WithBreadcrumb } from '@/components/Hoc/WithBreadcrumb';
import { BreadcrumbProvider } from '@/providers/BreadcrumbProvider';

import { WithHeader } from '../components/Hoc/WithHeader';

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => (
  <AuthGuard>
    <WithHeader />
    <BreadcrumbProvider>
      <main className="h-[calc(100vh-72px)]">
        <WithBreadcrumb />
        <div className="h-[calc(100%-64px)] overflow-auto p-4 md:p-8">
          <div className="mb-6">{children}</div>
        </div>
      </main>
    </BreadcrumbProvider>
  </AuthGuard>
);
