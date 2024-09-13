'use client';

import { dateIntl } from '@paalan/react-shared/lib';
import { AvatarUpload, Button } from '@paalan/react-ui';
import { FaWhatsapp } from 'react-icons/fa';

type ClientProfileInfoProps = {
  clientData: React.ComponentPropsWithoutRef<typeof Object>['data'];
};

export const ClientProfileInfo: React.FC<ClientProfileInfoProps> = ({ clientData }) => {
  // const handleSendMessage = () => {
  //   const phoneNumber = clientData?.phoneNumber;
  //   const message = encodeURIComponent('Hello, I would like to get in touch with you.');

  //   if (phoneNumber) {
  //     window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  //   }
  // };

  return (
    <div className="flex flex-col gap-6 p-5 dark:bg-gray-800">
      <div className="group relative self-center">
        <AvatarUpload src="/avatars/avatar-1.jpg" inputProps={{ value: '' }} />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="mb-1 text-xl font-bold">{clientData?.fullName}</h3>
        <div className="flex items-center justify-center text-xs text-gray-700 dark:text-gray-400">
          <h3 className="mr-2">{clientData?.clientCode}</h3>
          <span className="">|</span>
          <p className="ml-2">{dateIntl.format(clientData?.createdAt)}</p>
        </div>
        <Button color="green" className="mt-3">
          Send Message
          <FaWhatsapp className="mr-2 size-5" />
        </Button>
      </div>
    </div>
  );
};
