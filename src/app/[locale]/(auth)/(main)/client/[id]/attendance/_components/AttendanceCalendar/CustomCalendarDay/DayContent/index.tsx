'use client';

import { cn, dateIntl } from '@paalan/react-shared/lib';
import { Tooltip } from '@paalan/react-ui';
import type { FC } from 'react';

import type { RouterOutputs } from '@/trpc/shared';

type AttendanceCalendarProps = {
  date: Date;
  timeLogRecord: RouterOutputs['timeLogs']['getByClientIdWithDateRange'];
};

export const DayContent: FC<AttendanceCalendarProps> = ({ date, timeLogRecord }) => {
  const currentDate = new Date();
  const isToday = date.toDateString() === currentDate.toDateString();
  const formattedDate = dateIntl.format(date, { dateFormat: 'yyyy-MM-dd' });

  let dotColor = '';
  let tooltipContent = null;

  if (date < currentDate) {
    const present = timeLogRecord[formattedDate];
    if (present) {
      dotColor = 'bg-green-500';
      tooltipContent = (
        <div>
          <p className="font-semibold">Present</p>
          <p>
            Duration: {present.duration} Min{present.duration <= 1 ? '' : 's'}
          </p>
        </div>
      );
    } else {
      dotColor = 'bg-red-500';
      tooltipContent = <p className="font-semibold">Absent</p>;
    }
  }

  if (isToday && !timeLogRecord[formattedDate]) {
    dotColor = 'bg-blue-500';
    tooltipContent = <p className="font-semibold">Today</p>;
  }

  return (
    <Tooltip
      trigger={
        <div className="flex flex-col items-center justify-center">
          <div>{date.getDate()}</div>
          {/* {icon} */}
          {dotColor && <div className={cn('mt-1 size-2 rounded-full', dotColor)} />}
        </div>
      }
      content={tooltipContent}
    />
  );
};
