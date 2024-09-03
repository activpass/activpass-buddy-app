import type { FC, PropsWithChildren } from 'react';

import { AuthLayout } from '@/layouts/AuthLayout';
import { FeedbackLayout } from '@/layouts/FeedbackLayout';
import { RootLayout } from '@/layouts/RootLayout';
import type { Layouts } from '@/types';

const layouts = {
  auth: AuthLayout,
  root: RootLayout,
  feedback: FeedbackLayout,
} satisfies Record<Layouts, FC>;

type WithLayoutProps<L = Layouts> = PropsWithChildren<{ layout: L }>;

export const WithLayout: FC<WithLayoutProps<Layouts>> = ({ layout, children }) => {
  const LayoutComponent = layouts[layout] ?? RootLayout;

  return <LayoutComponent>{children}</LayoutComponent>;
};
