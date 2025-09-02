'use client';

import { ErrorInternalResponse, Strong, Text, toast } from '@paalan/react-ui';
import { type FC, useEffect, useRef } from 'react';

type ErrorPageProps = {
  error: Error;
};

const ErrorPage: FC<ErrorPageProps> = ({ error }) => {
  const initialRendered = useRef(false);

  useEffect(() => {
    if (initialRendered.current) return;
    toast.error(error.message);

    // eslint-disable-next-line no-console
    console.error('Error occurred:', error);

    initialRendered.current = true;
  }, [error]);

  return (
    <ErrorInternalResponse
      showIcon
      heading="An error occurred"
      subHeading={
        <Text>
          <Strong>Error Message:</Strong> {error.message}
        </Text>
      }
    />
  );
};
export default ErrorPage;
