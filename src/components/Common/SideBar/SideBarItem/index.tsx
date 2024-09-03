import type { FC } from 'react';
import { HiArrowUpRight } from 'react-icons/hi2';

import ActiveLink from '@/components/Common/ActiveLink';
import type { FormattedMessage } from '@/types';

import styles from './index.module.css';

type SideBarItemProps = {
  label: FormattedMessage;
  link: string;
};

export const SideBarItem: FC<SideBarItemProps> = ({ label, link }) => (
  <li className={styles.sideBarItem}>
    <ActiveLink href={link} activeClassName={styles.active}>
      <span className={styles.label}>{label}</span>

      {link.startsWith('http') && <HiArrowUpRight className={styles.icon} />}
    </ActiveLink>
  </li>
);
