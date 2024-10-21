'use client';

import { Calendar, Skeleton } from '@paalan/react-ui';
import { endOfMonth, startOfMonth } from 'date-fns';
import { type FC, useState } from 'react';

import { api } from '@/trpc/client';

import { CustomCalendarDay } from './CustomCalendarDay';
import { StatusBadge } from './StatusBadge';
import type { GetByClientIdWithDateRange } from './types';

const WithDayComponent = (timeLogRecord: GetByClientIdWithDateRange | undefined) => {
  const Component = ({ date, displayMonth }: { date: Date; displayMonth: Date }) => {
    return (
      <CustomCalendarDay
        date={date}
        displayMonth={displayMonth}
        timeLogRecord={timeLogRecord ?? {}}
      />
    );
  };
  return Component;
};

type AttendanceCalendarProps = {
  clientId: string;
};
export const AttendanceCalendar: FC<AttendanceCalendarProps> = ({ clientId }) => {
  const currentDate = new Date();
  const [startOfMonthDate, setStartOfMonthDate] = useState(startOfMonth(new Date()));

  const { isLoading, data } = api.timeLogs.getByClientIdWithDateRange.useQuery(
    {
      clientId,
      startDate: startOfMonth(startOfMonthDate),
      endDate: endOfMonth(startOfMonthDate),
    },
    {
      enabled: startOfMonthDate <= startOfMonth(currentDate), // Only fetch data for past months and current month
    }
  );

  return (
    <div className="w-fit">
      {isLoading ? (
        <Skeleton className="size-full sm:size-84" />
      ) : (
        <Calendar
          className="rounded-md border shadow"
          mode="single"
          showOutsideDays={false}
          month={startOfMonthDate}
          onMonthChange={setStartOfMonthDate}
          classNames={{
            head_row: 'flex my-2',
            head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1',
          }}
          components={{
            Day: WithDayComponent(data),
          }}
        />
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <StatusBadge text="Present" color="bg-green-500" />
        <StatusBadge text="Absent" color="bg-red-500" />
        <StatusBadge text="Today" color="bg-blue-500" />
      </div>
    </div>
  );
};
