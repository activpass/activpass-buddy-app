import type { FC, PropsWithChildren } from 'react';

import { AuthLayout } from '@/layouts/AuthLayout';
import { CenteredLayout } from '@/layouts/CenteredLayout';
import { HomeLayout } from '@/layouts/HomeLayout';
import { RootLayout } from '@/layouts/RootLayout';
import type { Layouts } from '@/types';

const layouts = {
  auth: AuthLayout,
  root: RootLayout,
  home: HomeLayout,
  centered: CenteredLayout,
} satisfies Record<Layouts, FC>;

type WithLayoutProps<L = Layouts> = PropsWithChildren<{ layout: L }>;

export const WithLayout: FC<WithLayoutProps<Layouts>> = ({ layout, children }) => {
  const LayoutComponent = layouts[layout] ?? RootLayout;

  return <LayoutComponent>{children}</LayoutComponent>;
};
