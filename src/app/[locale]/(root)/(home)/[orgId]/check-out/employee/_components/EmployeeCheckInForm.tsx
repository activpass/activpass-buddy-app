import type { FC } from 'react';

type EmployeeCheckOutFormProps = {
  orgId: string;
};
export const EmployeeCheckOutForm: FC<EmployeeCheckOutFormProps> = ({ orgId }) => {
  return <div>EmployeeCheckOutForm - {orgId}</div>;
};
