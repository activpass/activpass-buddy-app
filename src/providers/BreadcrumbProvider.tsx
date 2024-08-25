'use client';

import { createContext } from '@paalan/react-shared/utils';
import type { Breadcrumb } from '@paalan/react-ui';
import { type FC, useEffect } from 'react';

export type BreadcrumbItem = React.ComponentPropsWithoutRef<typeof Breadcrumb>['items'][number];

export type BreadcrumbContextType = {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  addItem: (item: BreadcrumbItem) => void;
  removeItem: (item: BreadcrumbItem) => void;
};
const [BreadcrumbProvider, useBreadcrumb] = createContext<BreadcrumbContextType>({
  hookName: 'useBreadcrumb',
  providerName: 'BreadcrumbProvider',
});

export { BreadcrumbProvider, useBreadcrumb };

type AddBreadcrumbItemProps = {
  items: BreadcrumbItem[];
};
export const AddBreadcrumbItem: FC<AddBreadcrumbItemProps> = ({ items }) => {
  const { addItem } = useBreadcrumb();

  useEffect(() => {
    if (!items) return;
    items.forEach(item => addItem(item));
  }, [addItem, items]);

  return null;
};

export const SetBreadcrumbItem: FC<AddBreadcrumbItemProps> = ({ items }) => {
  const { setItems } = useBreadcrumb();

  useEffect(() => {
    if (!items) return;
    setItems(items);
  }, [setItems, items]);

  return null;
};
