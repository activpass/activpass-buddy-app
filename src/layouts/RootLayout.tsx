import type { FC, PropsWithChildren } from 'react';

import styles from './layouts.module.css';

export const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <main className={styles.rootLayout}>{children}</main>
);
