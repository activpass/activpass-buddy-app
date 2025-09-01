import type { FC } from 'react';

type EmployeeCheckInFormProps = {
  orgId: string;
};
export const EmployeeCheckInForm: FC<EmployeeCheckInFormProps> = ({ orgId }) => {
  return <div>EmployeeCheckInForm - {orgId}</div>;
};
