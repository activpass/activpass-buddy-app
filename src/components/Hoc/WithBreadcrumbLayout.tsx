'use client';

import { InfoCircledIcon, QuestionMarkCircledIcon } from '@paalan/react-icons';
import {
  Breadcrumb,
  Button,
  Flex,
  HStack,
  IconButton,
  Paper,
  Strong,
  Tooltip,
} from '@paalan/react-ui';
import { Package2 } from 'lucide-react';
import { type FC, type PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { BreadcrumbLink } from '@/components/BreadcrumbLink';
import { type BreadcrumbItem, BreadcrumbProvider } from '@/providers/BreadcrumbProvider';

type WithBreadcrumbLayoutProps = PropsWithChildren<{
  items?: BreadcrumbItem[];
}>;
export const WithBreadcrumbLayout: FC<WithBreadcrumbLayoutProps> = ({
  items: itemsProp,
  children,
}) => {
  const [items, setItems] = useState<BreadcrumbItem[]>(itemsProp || []);

  useEffect(() => {
    if (!itemsProp) return;
    setItems(itemsProp);
  }, [itemsProp]);

  const addItem = useCallback((item: BreadcrumbItem) => {
    return setItems(prevItems => {
      if (typeof item.label === 'string' && prevItems.some(i => i.label === item.label)) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  }, []);

  const removeItem = useCallback((item: BreadcrumbItem) => {
    return setItems(prevItems => prevItems.filter(i => i !== item));
  }, []);

  const tokens = [1, 2, 3, 4];

  return (
    <BreadcrumbProvider
      value={{
        items,
        setItems,
        addItem,
        removeItem,
      }}
    >
      <Paper className="flex items-center gap-2 p-4 text-sm md:px-6">
        <Breadcrumb items={items} Link={BreadcrumbLink} />
        <HStack className="ml-auto" gap="4">
          <Flex gap="2" alignItems="center" mr="3">
            {tokens.map(token => (
              <Flex
                key={token}
                alignItems="center"
                justifyContent="center"
                className="size-8 rounded-sm border shadow-sm"
              >
                <Strong>{token}</Strong>
              </Flex>
            ))}
            <Tooltip
              className="max-w-52"
              content="This token is used to verify your identity, Will generate a new token every 1 minute."
              trigger={<InfoCircledIcon className="size-5" />}
            />
          </Flex>
          <Button variant="outline" size="sm">
            Feedback
          </Button>
          <IconButton icon={<Package2 className="size-5" />} />
          <IconButton icon={<QuestionMarkCircledIcon boxSize="5" />} />
        </HStack>
      </Paper>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</div>
    </BreadcrumbProvider>
  );
};
