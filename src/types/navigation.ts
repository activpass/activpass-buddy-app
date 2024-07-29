import type { HTMLAttributeAnchorTarget, ReactNode } from 'react';

export interface FooterConfig {
  text: string;
  link: string;
}

export interface SocialConfig {
  icon: string;
  link: string;
  alt?: string;
}

export type AuthNavigationKeys = 'dashboard' | 'client' | 'employee' | 'finance' | 'subscription';

export type GuestNavigationKeys = 'signIn' | 'signUp';

export interface NavigationEntry {
  label?: string;
  link?: string;
  items?: Record<string, NavigationEntry>;
  target?: HTMLAttributeAnchorTarget;
  icon?: ReactNode;
}

export type TopNavigationRecord = {
  auth: Record<AuthNavigationKeys, NavigationEntry>;
  root: Record<GuestNavigationKeys, NavigationEntry>;
};

export type TopNavigationKeys = keyof TopNavigationRecord;

export interface NavigationConfig {
  topNavigation: TopNavigationRecord;
  sideNavigation: TopNavigationRecord;
}
