export type ClientRecord = {
  id: string;
  fullName: string;
  phoneNumber: number;
  membershipPlan: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
};
