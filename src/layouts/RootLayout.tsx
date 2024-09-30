import type { FC, PropsWithChildren } from 'react';

import { WithRootHeader } from '@/components/Hoc/WithRootHeader';

import styles from './layouts.module.css';

export const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <WithRootHeader />
    <main className={styles.rootLayout}>{children}</main>
  </>
);
