'use client';

import { Badge, Calendar, TooltipProvider } from '@paalan/react-ui';
import { useState } from 'react';

import { DayContent } from '../DayContent';

const DayComponent = ({ date, ...props }: { date: Date }) => {
  return (
    <div {...props} className="size-12 p-0 font-normal aria-selected:opacity-100">
      <DayContent day={date} />
    </div>
  );
};

export const AttendanceCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <TooltipProvider>
      <div className="max-w-sm">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            Day: DayComponent,
          }}
        />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="flex items-center">
            <div className="mr-2 size-2 rounded-full bg-green-500" />
            Present
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <div className="mr-2 size-2 rounded-full bg-red-500" />
            Absent
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <div className="mr-2 size-2 rounded-full bg-yellow-500" />
            Holiday
          </Badge>
        </div>
      </div>
    </TooltipProvider>
  );
};
