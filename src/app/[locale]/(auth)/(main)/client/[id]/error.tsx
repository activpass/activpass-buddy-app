'use client';

import type { FC } from 'react';
import { ErrorInternalServerResponse } from '@paalan/react-ui';

type ErrorPageProps = {
  error: Error;
};
const ErrorPage: FC<ErrorPageProps> = ({ error }) => {
  return <ErrorInternalServerResponse subHeading={error.message} />;
};

export default ErrorPage;
