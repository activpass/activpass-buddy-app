import { cn } from '@paalan/react-shared/lib';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@paalan/react-ui';
import type { FC } from 'react';
import { LuCheckCircle2 } from 'react-icons/lu';

import { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';
import type { RouterOutputs } from '@/trpc/shared';
import { currencyIntl } from '@/utils/currency-intl';

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2">
    <LuCheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-sm">{text}</p>
  </div>
);

type MembershipPricingCardProps = RouterOutputs['membershipPlans']['get'] & {
  selected: boolean;
  onSelect: () => void;
};
export const MembershipPricingCard: FC<MembershipPricingCardProps> = ({
  tenure,
  name: planName,
  amount,
  discountPercentage,
  discountedAmount,
  description,
  features,
  selected,
  onSelect,
}) => {
  const onSelectPlan = () => {
    if (selected) return;
    onSelect();
  };
  const discountApplied = !!discountPercentage;
  return (
    <Card
      className={cn(`mx-auto flex w-72 cursor-pointer flex-col justify-between p-1`, {
        'bg-primary text-white dark:bg-primary/90': selected,
        'transition-transform duration-300 hover:scale-105 hover:shadow-lg': !selected,
      })}
      onClick={e => {
        e.stopPropagation();
        onSelectPlan();
      }}
    >
      <div>
        <CardHeader className="p-0 pb-6 pt-4">
          <div className="flex justify-between">
            <CardTitle
              className={cn('text-xl text-zinc-700 dark:text-zinc-300', {
                'text-white dark:text-white': selected,
              })}
            >
              {planName}
            </CardTitle>
            {discountApplied && (
              <div
                className={cn(
                  'h-fit rounded-xl bg-zinc-200 px-2.5 py-1 text-sm text-black dark:bg-zinc-800 dark:text-white'
                )}
              >
                Save {discountPercentage}%
              </div>
            )}
          </div>
          <div className="flex gap-0.5 pt-4">
            <div className="flex flex-col gap-2">
              <h3
                className={cn('text-3xl font-bold', {
                  'text-xl line-through': discountApplied,
                })}
              >
                {currencyIntl.format(amount)}
              </h3>
              {discountApplied && (
                <h3 className={cn('text-3xl font-bold')}>
                  {currencyIntl.format(discountedAmount)}
                </h3>
              )}
            </div>
            <span className="mb-1 flex flex-col justify-end text-sm">
              {CLIENT_MEMBERSHIP_TENURE[tenure].perValue}
            </span>
          </div>
          <CardDescription
            className={cn('pt-1.5', {
              'text-white': selected,
            })}
          >
            {description}
          </CardDescription>

          {/* <Button
            type="button"
            variant="solid"
            color={selected ? 'orange' : 'primary'}
            className={cn('w-full transition-colors', {
              'pointer-events-none': selected,
            })}
            onClick={e => {
              e.stopPropagation();
              onSelectPlan();
            }}
          >
            {selected ? 'Selected' : 'Choose Plan'}
          </Button> */}
        </CardHeader>
        <CardContent
          className={cn('flex flex-col gap-2 p-0 text-zinc-700 dark:text-zinc-300', {
            'text-white dark:text-white': selected,
          })}
        >
          {features.map(feature => (
            <CheckItem key={feature.value} text={feature.value} />
          ))}
        </CardContent>
      </div>
    </Card>
  );
};
