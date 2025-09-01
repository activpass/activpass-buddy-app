'use client';

import { ErrorInternalServerResponse } from '@paalan/react-ui';
import type { FC } from 'react';

type ErrorPageProps = {
  error: Error;
};
const ErrorPage: FC<ErrorPageProps> = ({ error }) => {
  return <ErrorInternalServerResponse heading="An error occurred" subHeading={error.message} />;
};

export default ErrorPage;
