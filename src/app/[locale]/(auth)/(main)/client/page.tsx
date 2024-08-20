import { Heading } from '@paalan/react-ui';

import ClientAnalytics from './_components/ClientAnalytics';
import ClientTable from './_components/ClientTable';

const ClientPage = () => {
  return (
    <div>
      <Heading className="mb-0">Client Zone</Heading>
      <p className="mb-8 text-gray-600">
        This section provides all the essential information about our clients.
      </p>
      <ClientAnalytics />
      <ClientTable />
    </div>
  );
};

export default ClientPage;
