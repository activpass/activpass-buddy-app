'use client';

import { ErrorInternalResponse } from '@paalan/react-ui';
import type { FC } from 'react';

type ErrorPageProps = {
  error: Error;
};
const ErrorPage: FC<ErrorPageProps> = ({ error }) => {
  return <ErrorInternalResponse heading="An error occured" subHeading={error.message} showIcon />;
};

export default ErrorPage;
