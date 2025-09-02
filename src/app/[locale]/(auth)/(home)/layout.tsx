import { Flex } from '@paalan/react-ui';
import type { FC, PropsWithChildren } from 'react';

import { WithLayout } from '@/components/Hoc/withLayout';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WithLayout layout="home">
      <Flex className="min-h-108 lg:w-128">{children}</Flex>
    </WithLayout>
  );
};
export default Layout;
