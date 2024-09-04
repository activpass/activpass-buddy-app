import { Box, Heading, Text } from '@paalan/react-ui';
import type { FC } from 'react';

type MembershipPricingHeaderProps = {
  title: string;
  subtitle: string;
};
export const MembershipPricingHeader: FC<MembershipPricingHeaderProps> = ({ title, subtitle }) => (
  <Box as="section" className="flex flex-col items-center justify-center">
    <Heading as="h3">{title}</Heading>
    <Text className="pt-1 text-4xl font-bold text-primary">{subtitle}</Text>
    <br />
  </Box>
);
