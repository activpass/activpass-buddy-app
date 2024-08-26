import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@paalan/react-ui';

import { ClientCheckInForm } from './_components/ClientCheckInForm';

const CheckInClientPage = () => {
  return (
    <Card className="lg:min-w-128">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Check In - <span className="text-primary">Client</span>
        </CardTitle>
        <CardDescription className="text-balance">
          Fill in the form below to check in a client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientCheckInForm />
      </CardContent>
    </Card>
  );
};

export default CheckInClientPage;
