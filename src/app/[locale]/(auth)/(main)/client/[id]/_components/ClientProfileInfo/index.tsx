'use client';

import { AvatarUpload, Button } from '@paalan/react-ui';
import { FaWhatsapp } from 'react-icons/fa';

import { api } from '@/trpc/client';

type ClientProfileInfoProps = {
  clientId: string;
};

export const ClientProfileInfo: React.FC<ClientProfileInfoProps> = ({ clientId }) => {
  const { data: clientData } = api.clients.get.useQuery(clientId);

  const handleSendMessage = () => {
    const phoneNumber = clientData?.phoneNumber;
    const message = encodeURIComponent('Hello, I would like to get in touch with you.');

    if (phoneNumber) {
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

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
          <p className="ml-2">
            {clientData?.createdAt ? new Date(clientData.createdAt).toLocaleDateString() : ''}
          </p>
        </div>
        <Button color="green" className="mt-3" onClick={handleSendMessage}>
          Send Message
          <FaWhatsapp className="mr-2 size-5" />
        </Button>
      </div>
    </div>
  );
};
