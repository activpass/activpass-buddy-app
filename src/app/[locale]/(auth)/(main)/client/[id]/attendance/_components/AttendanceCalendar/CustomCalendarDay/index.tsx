import { getMonth } from 'date-fns';
import type { FC } from 'react';

import type { GetByClientIdWithDateRange } from '../types';
import { DayContent } from './DayContent';

type CustomCalendarDayProps = {
  timeLogRecord: GetByClientIdWithDateRange;
  date: Date;
  displayMonth: Date;
};
export const CustomCalendarDay: FC<CustomCalendarDayProps> = ({
  date,
  displayMonth,
  timeLogRecord,
}) => {
  const dateMonth = getMonth(date);
  const displayMonthValue = getMonth(displayMonth);
  const isNotCurrentMonth = dateMonth !== displayMonthValue;

  return (
    <div className="size-10 sm:size-12">
      {isNotCurrentMonth ? '' : <DayContent date={date} timeLogRecord={timeLogRecord} />}
    </div>
  );
};
