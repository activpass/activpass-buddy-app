import type { FC, PropsWithChildren } from 'react';

import { WithLayout } from '@/components/Hoc/withLayout';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <WithLayout layout="home">{children}</WithLayout>;
};
export default Layout;
