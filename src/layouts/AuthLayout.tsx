import type { FC, PropsWithChildren } from 'react';

import { WithHeader } from '../components/Hoc/WithHeader';

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => (
  <>
    {/* <WithNavBar /> */}
    <WithHeader />
    <main>{children}</main>
  </>
);
