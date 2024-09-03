import { cn } from '@paalan/react-shared/lib';
import type { FC, HTMLAttributeAnchorTarget, PropsWithChildren, ReactNode } from 'react';
import { HiArrowUpRight } from 'react-icons/hi2';

import ActiveLink from '@/components/Common/ActiveLink';

import styles from './index.module.css';

type NavItemType = 'nav' | 'footer';

type NavItemProps = {
  href: string;
  type?: NavItemType;
  className?: string;
  target?: HTMLAttributeAnchorTarget | undefined;
  icon?: ReactNode;
};

const NavItem: FC<PropsWithChildren<NavItemProps>> = ({
  href = '',
  type = 'nav',
  children,
  className,
  target,
  icon,
}) => (
  <ActiveLink
    href={href}
    className={cn(styles.navItem, styles[type], className)}
    activeClassName={styles.active}
    allowSubPath={href.startsWith('/')}
    target={target}
  >
    {icon}
    <span className={styles.label}>{children}</span>

    {((type === 'nav' && href.startsWith('http')) || target === '_blank') && (
      <HiArrowUpRight className={styles.icon} />
    )}
  </ActiveLink>
);

export default NavItem;
