import { Box } from '@paalan/react-ui';
import type { FC, PropsWithChildren } from 'react';

import { WithLayout } from '@/components/Hoc/withLayout';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WithLayout layout="home">
      <Box className="min-h-108 lg:w-128">{children}</Box>
    </WithLayout>
  );
};
export default Layout;
