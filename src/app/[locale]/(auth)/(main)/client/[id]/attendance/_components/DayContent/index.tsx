'use client';

import { TooltipContent, TooltipRoot, TooltipTrigger } from '@paalan/react-ui';
import type { FC } from 'react';
import { LuCoffee } from 'react-icons/lu';

type AttendanceStatus =
  | { status: 'present'; duration: string; workout: string }
  | { status: 'absent' };

const mockAttendance: { [key: string]: AttendanceStatus } = {
  '2024-06-01': { status: 'present', duration: '1h 30m', workout: 'Cardio + Strength' },
  '2024-06-03': { status: 'absent' },
  '2024-06-05': { status: 'present', duration: '2h', workout: 'Full body workout' },
  '2024-06-07': { status: 'present', duration: '1h', workout: 'Yoga class' },
  '2024-06-10': { status: 'absent' },
  '2024-06-15': { status: 'present', duration: '1h 45m', workout: 'HIIT session' },
  '2024-06-20': { status: 'present', duration: '2h 15m', workout: 'Weight training' },
  '2024-06-25': { status: 'absent' },
};

const tamilNaduHolidays: { [key: string]: string } = {
  '2024-01-15': 'Pongal',
  '2024-01-16': 'Thiruvalluvar Day',
  '2024-04-14': 'Tamil New Year',
  '2024-08-15': 'Independence Day',
  '2024-09-17': 'Vinayagar Chaturthi',
  '2024-10-23': 'Ayudha Pooja',
  '2024-10-24': 'Vijaya Dasami',
  '2024-11-12': 'Deepavali',
};

type AttendanceCalendarProps = {
  day: Date;
};

export const DayContent: FC<AttendanceCalendarProps> = ({ day }) => {
  const dateString = day.toISOString().split('T')[0];
  if (!dateString) return null;

  const holiday = tamilNaduHolidays[dateString];
  const attendance = mockAttendance[dateString];

  let dotColor = '';
  let tooltipContent = null;
  let icon = null;

  if (holiday) {
    icon = <LuCoffee className="size-4 text-yellow-500" />;
    tooltipContent = (
      <div>
        <p className="font-semibold">{holiday}</p>
        <p>Gym closed for holiday</p>
      </div>
    );
  } else if (attendance) {
    if (attendance.status === 'present') {
      dotColor = 'bg-green-500';
      tooltipContent = (
        <div>
          <p className="font-semibold">Present</p>
          <p>Duration: {attendance.duration}</p>
          <p>Workout: {attendance.workout}</p>
        </div>
      );
    } else if (attendance.status === 'absent') {
      dotColor = 'bg-red-500';
      tooltipContent = (
        <div>
          <p className="font-semibold">Absent</p>
        </div>
      );
    }
  }

  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <div className="flex size-full flex-col items-center justify-center">
          <span className="text-sm">{day.getDate()}</span>
          {icon}
          {dotColor && <div className={`mt-1 size-2 rounded-full ${dotColor}`} />}
        </div>
      </TooltipTrigger>
      {tooltipContent && (
        <TooltipContent className="bg-gray-800 text-gray-100">{tooltipContent}</TooltipContent>
      )}
    </TooltipRoot>
  );
};
