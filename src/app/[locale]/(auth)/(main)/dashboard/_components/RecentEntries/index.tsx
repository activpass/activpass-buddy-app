'use client';

import {
  AvatarImage,
  AvatarRoot,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@paalan/react-ui';
import type { StaticImageData } from 'next/image';

import ActivpassIMG from '@/public/logos/png/activpass-icon-blue.png';

type EntryData = {
  id: number;
  name: string;
  email: string;
  dateTime: string;
  avatar: StaticImageData;
};

const entriesData: EntryData[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    dateTime: '2024-08-05T10:30:00',
    avatar: ActivpassIMG,
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    dateTime: '2024-08-05T11:00:00',
    avatar: ActivpassIMG,
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    dateTime: '2024-08-05T12:15:00',
    avatar: ActivpassIMG,
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    dateTime: '2024-08-05T01:45:00',
    avatar: ActivpassIMG,
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    dateTime: '2024-08-05T03:20:00',
    avatar: ActivpassIMG,
  },
];

const RecentEntries: React.FC = () => {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      formattedDate: date.toLocaleDateString(),
      formattedTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {entriesData.map(entry => {
          const { formattedDate, formattedTime } = formatDateTime(entry.dateTime);
          return (
            <div key={entry.id} className="flex items-center gap-4">
              <div className="hidden size-9 sm:flex">
                <AvatarRoot>
                  <AvatarImage src={entry.avatar.src} alt="Avatar" />
                </AvatarRoot>
              </div>
              <div className="w-[90%]">
                <p className="text-sm font-medium leading-none">{entry.name}</p>
                <p className="text-sm text-muted-foreground">{entry.email}</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {formattedDate} at {formattedTime}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentEntries;
