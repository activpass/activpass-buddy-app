'use client';

import type { FC } from 'react';

type ErrorPageProps = {
  error: Error;
};
const ErrorPage: FC<ErrorPageProps> = ({ error }) => {
  return (
    <div>
      <h1>{error.message}</h1>
    </div>
  );
};

export default ErrorPage;
