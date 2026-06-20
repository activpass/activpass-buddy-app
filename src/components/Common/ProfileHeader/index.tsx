import { Box, Button, Flex, Heading, Text } from '@paalan/react-ui';
import type { FC } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

type ProfileHeaderProps = {
  title: string;
  description?: string;
  showActionButton?: boolean;
};
export const ProfileHeader: FC<ProfileHeaderProps> = ({
  title,
  description,
  showActionButton = true,
}) => {
  return (
    <Flex justifyContent="between" alignItems="center">
      <Box>
        <Heading as="h3">{title}</Heading>
        <Text fontSize="sm" className="text-muted-foreground">
          {description}
        </Text>
      </Box>
      {showActionButton && (
        <Button color="green" leftIcon={<FaWhatsapp className="size-5" />} disabled>
          Send Message
        </Button>
      )}
    </Flex>
  );
};
