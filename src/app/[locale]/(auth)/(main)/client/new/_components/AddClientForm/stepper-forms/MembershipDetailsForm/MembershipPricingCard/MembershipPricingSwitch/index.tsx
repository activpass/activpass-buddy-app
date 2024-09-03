import { Tabs, type TabsProps, Text } from '@paalan/react-ui';
import type { FC } from 'react';

import { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';
import type { CreateMembershipPlanSchema } from '@/validations/client/membership.validation';

type MembershipPricingSwitchProps = {
  onChangeValue: (value: CreateMembershipPlanSchema['tenure']) => void;
  value: string;
};

export const MembershipPricingSwitch: FC<MembershipPricingSwitchProps> = ({
  onChangeValue,
  value,
}) => {
  const tabs: TabsProps['tabs'] = Object.entries(CLIENT_MEMBERSHIP_TENURE).map(
    ([key, tenureValue]) => ({
      label: tenureValue.display,
      value: key,
    })
  );

  return (
    <>
      <Text className="mb-3 text-center text-lg text-muted-foreground">
        Select a membership plan that fits your fitness goals and schedule.
      </Text>
      <Tabs
        activeTab={value}
        tabs={tabs}
        className="mx-auto"
        onTabChange={selectedValue => {
          onChangeValue(selectedValue as CreateMembershipPlanSchema['tenure']);
        }}
        tabListClassName="px-2 py-6"
        strip={false}
      />
    </>
  );
};
