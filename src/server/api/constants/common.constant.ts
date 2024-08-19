export const UserType = {
  partner: 'PARTNER',
  client: 'CLIENT',
  employee: 'EMPLOYEE',
} as const;

export const RoleConstant = {
  superAdmin: 'super-admin',
  admin: 'admin',
  employee: 'employee',
  client: 'client',
} as const;

export const AccountType = {
  savings: 'savings',
  current: 'current',
  checking: 'checking',
  notSpecified: 'not_specified',
} as const;

export const PanType = {
  all: 'all',
  regular: 'regular',
  expense: 'expense',
  bonus: 'bonus',
} as const;

export const LeaveStatus = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
} as const;

export const PayrollPaymentStatus = {
  paid: 'paid',
  unpaid: 'unpaid',
  failure: 'failure',
  pending: 'pending',
  notSpecified: 'not_specified',
} as const;

export const Currency = {
  inr: 'inr',
  usd: 'usd',
  eur: 'eur',
} as const;

export const DeductionType = {
  professionalTax: 'professional_tax',
  employeeProvidentFund: 'employee_provident_fund',
  employeeStateInsurance: 'employee_state_insurance',
  incomeTax: 'income_tax',
  healthInsurancePremium: 'health_insurance_premium',
  loanRepayments: 'loan_repayments',
} as const;

export const EarningType = {
  income: 'income',
  overTime: 'overtime',
  basic: 'basic',
  hra: 'hra',
  specialAllowance: 'special_allowance',
  incentive: 'incentive',
} as const;

export const Gender = {
  male: 'male',
  female: 'female',
  transgender: 'transgender',
  others: 'others',
} as const;

export const MembershipType = {
  monthly: 'monthly',
  quarterly: 'quarterly',
  halfYearly: 'halfYearly',
  annually: 'annually',
} as const;

export const PaymentMethod = {
  creditCard: 'creditCard',
  debitCard: 'debitCard',
  cash: 'cash',
  upi: 'upi',
  bankTransfer: 'bankTransfer',
} as const;

export const PaymentFrequency = {
  oneTime: 'one_time',
  recurring: 'recurring',
} as const;

export const EmployeeTimeLogStatus = {
  checkedIn: 'checked_in',
  checkedOut: 'checked_out',
} as const;

export const BookingStatus = {
  pending: 'pending',
  booked: 'booked',
  cancelled: 'cancelled',
  completed: 'completed',
} as const;

export const FitnessLevel = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
} as const;

export const DayPreference = {
  weekDay: 'weekDay',
  weekEnd: 'weekEnd',
  days: 'days',
} as const;

export const AdditionalService = {
  nutritionalCounselling: 'nutritionalCounselling',
  others: 'others',
} as const;

export const Compensation = {
  bonuses: 'bonuses',
  incentives: 'incentives',
  others: 'others',
} as const;

export const RelationShip = {
  father: 'father',
  mother: 'mother',
  friend: 'friend',
  sibling: 'sibling',
  guardian: 'guardian',
} as const;

export const Software = {
  gymMgmtSoftware: 'gym_management_software',
  accountingSoftware: 'accounting_software',
  crmSoftware: 'crm_software',
  noSoftware: 'no_software',
  other: 'other',
} as const;

export const Facilities = {
  lockerRooms: 'locker_rooms',
  showers: 'showers',
  parking: 'parking',
  wifi: 'wifi',
  cafeSmoothieBar: 'cafe_smoothie_bar',
  other: 'other',
} as const;

export const FacilitySize = {
  small: 'small(under 1000 sq. ft./100 sq. m.)',
  medium: 'medium(1000-3000 sq. ft./100-300 sq. m.)',
  large: 'large(over 3000 sq. ft./300 sq. m.)',
} as const;

export const MinimumBookingTime = {
  min30: '30 m',
  hr1: '1 h',
  hr1min30: '1 h 30 m',
  hr2: '2 h',
} as const;

export const PaymentStatus = {
  paid: 'paid',
  unpaid: 'unpaid',
  failure: 'failure',
  pending: 'pending',
} as const;

export const PurchaseType = {
  subscription: 'subscription',
} as const;

export const PaymentMode = {
  card: 'card',
  cash: 'cash',
  upi: 'upi',
} as const;

export const Period = {
  monthly: 'monthly',
  quarterly: 'quarterly',
  halfYearly: 'halfYearly',
  annually: 'annually',
} as const;

export const BillingCycle = {
  monthly: 'monthly',
  quarterly: 'quarterly',
  halfYearly: 'halfYearly',
  annually: 'annually',
} as const;

export const LeaveType = {
  medical: 'medical',
  casual: 'casual',
} as const;
