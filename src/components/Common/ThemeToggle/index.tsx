'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useNextTheme } from '@paalan/react-providers/NextThemeProvider';
import { cn } from '@paalan/react-shared/lib';
import { useTranslations } from 'next-intl';
import type { FC, MouseEvent } from 'react';

import styles from './index.module.css';

type ThemeToggleProps = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

const ThemeToggle: FC<ThemeToggleProps> = ({ onClick = () => {}, className }) => {
  const { resolvedTheme, setTheme } = useNextTheme();
  const t = useTranslations();

  const ariaLabel = t('common.themeToggle.label');

  const toggleCurrentTheme = (e: MouseEvent<HTMLButtonElement>) => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    onClick(e);
  };

  return (
    <button
      type="button"
      onClick={toggleCurrentTheme}
      className={cn(styles.themeToggle, 'hover:dark:bg-neutral-800', className)}
      aria-label={ariaLabel}
    >
      <MoonIcon className="block dark:hidden" height="20" />
      <SunIcon className="hidden dark:block" height="20" />
    </button>
  );
};

export default ThemeToggle;
