import { cn, dateIntl } from '@paalan/react-shared/lib';
import { Button, Card, Heading, Text } from '@paalan/react-ui';
import { startOfDay } from 'date-fns';
import { type FC } from 'react';

import { currencyIntl } from '@/utils/currency-intl';

import type { EmployeeData } from '../../../../types';

type JobDetailsHeaderProps = {
  data: EmployeeData;
};

export const JobDetailsHeader: FC<JobDetailsHeaderProps> = ({ data }) => {
  const { jobDetails, payroll, workSchedule } = data;
  const dateOfSalary = payroll?.dateOfSalary?.getDate() || startOfDay(new Date()).getDate();
  const grossSalary = payroll?.grossSalary || 0;
  const nextSalaryDate = new Date();

  if (nextSalaryDate.getDate() > dateOfSalary) {
    nextSalaryDate.setMonth(nextSalaryDate.getMonth() + 1);
  }

  nextSalaryDate.setDate(dateOfSalary);

  const remainingDays = nextSalaryDate
    ? Math.ceil(
        (startOfDay(nextSalaryDate).getTime() - startOfDay(new Date()).getTime()) /
          (1000 * 3600 * 24)
      )
    : 0;

  const isActive = remainingDays > 0;

  const getTextColorClass = () => {
    if (remainingDays <= 0) return 'text-red-500';
    if (remainingDays <= 3) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className="mb-6">
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between">
        {/* Plan Information Section */}
        <aside>
          <Heading as="h4">{jobDetails?.title}</Heading>
          {jobDetails?.description && (
            <Text fontSize="sm" className="mb-3 text-muted-foreground">
              {jobDetails?.description}
            </Text>
          )}
          <div className="flex flex-col gap-1">
            {!!workSchedule && (
              <Text fontSize="sm">
                <span className="font-semibold text-gray-900 dark:text-white">Shift Time:</span>{' '}
                <span>
                  {workSchedule.shiftStartTime} - {workSchedule.shiftEndTime}
                </span>
              </Text>
            )}
            <Text fontSize="sm">
              <span className="font-semibold text-gray-900 dark:text-white">Next Salary Date:</span>{' '}
              <span>{dateIntl.format(nextSalaryDate)}</span>
            </Text>
          </div>

          <Button className="mt-4" disabled>
            Pay Salary
          </Button>
        </aside>

        {/* Plan Status and Amount Section */}
        <div className="flex flex-col items-start space-y-2 md:items-end md:space-y-4">
          <div
            className={cn(
              'flex items-center space-x-2',
              isActive ? 'text-green-500' : 'text-red-500'
            )}
          >
            <div className={`size-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{isActive ? 'Active' : 'Salary Due'}</span>
          </div>

          <Heading as="h1" className="text-lg md:text-2xl">
            {currencyIntl.format(grossSalary)}
          </Heading>

          <Text fontSize="sm" className={getTextColorClass()}>
            {remainingDays > 0 ? `${remainingDays} days remaining` : 'Salary due now'}
          </Text>
        </div>
      </div>
    </Card>
  );
};
