export const CLIENT_MEMBERSHIP_TENURE = {
  MONTHLY: {
    value: 'MONTHLY',
    display: 'Monthly',
    perValue: '/month',
  },
  QUARTERLY: {
    value: 'QUARTERLY',
    display: 'Quarterly',
    perValue: '/quarter',
  },
  HALF_YEARLY: {
    value: 'HALF_YEARLY',
    display: 'Half Yearly',
    perValue: '/half-year',
  },
  YEARLY: {
    value: 'YEARLY',
    display: 'Yearly',
    perValue: '/year',
  },
} as const;
