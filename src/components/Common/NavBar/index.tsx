'use client';

import { Label } from '@paalan/react-ui';
import type { ComponentProps, FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import { useState } from 'react';
import { HiBars3, HiXMark } from 'react-icons/hi2';

import { SignOutButton } from '@/components/Auth/SignOutButton';
import { LanguageSwitcher } from '@/components/Common/LanguageSwitcher';
import ThemeToggle from '@/components/Common/ThemeToggle';
import Link from '@/components/Link';
import type { FormattedMessage } from '@/types';

import style from './index.module.css';
import NavItem from './NavItem';

const navInteractionIcons = {
  show: <HiBars3 className={style.navInteractionIcon} />,
  close: <HiXMark className={style.navInteractionIcon} />,
};

type NavbarProps = {
  navItems: Array<{
    text: FormattedMessage;
    link: string;
    target?: HTMLAttributeAnchorTarget | undefined;
    icon?: ReactNode;
  }>;
  languages: ComponentProps<typeof LanguageSwitcher>;
  onThemeTogglerClick: () => void;
};

const NavBar: FC<NavbarProps> = ({ navItems, languages, onThemeTogglerClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`${style.container}`}>
      <div className={style.demoIconAndMobileItemsToggler}>
        <Link className={style.demoIconWrapper} href="/" aria-label="Home">
          Activpass
        </Link>

        <Label
          onClick={() => setIsMenuOpen(prev => !prev)}
          className={style.sidebarItemTogglerLabel}
          htmlFor="sidebarItemToggler"
        >
          {navInteractionIcons[isMenuOpen ? 'close' : 'show']}
        </Label>
      </div>

      <input className="peer hidden" id="sidebarItemToggler" type="checkbox" />

      <div className={`${style.main} peer-checked:flex`}>
        <div className={style.navItems}>
          {navItems.map(({ text, link, target, icon }) => (
            <NavItem key={link} href={link} target={target} icon={icon}>
              {text}
            </NavItem>
          ))}
        </div>

        <div className={style.actionsWrapper}>
          <ThemeToggle onClick={onThemeTogglerClick} />

          <LanguageSwitcher
            onChange={languages.onChange}
            availableLanguages={languages.availableLanguages}
            currentLanguage={languages.currentLanguage}
          />
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
