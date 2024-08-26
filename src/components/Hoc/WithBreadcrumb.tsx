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
import { type FC } from 'react';

import { BreadcrumbLink } from '@/components/BreadcrumbLink';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';

export const WithBreadcrumb: FC = () => {
  const { items } = useBreadcrumb();
  const tokens = [1, 2, 3, 4];

  return (
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
  );
};
