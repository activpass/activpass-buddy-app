// Utility functions
export const generateOnboardingToken = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const calculateExpirationDate = (days: number = 7): Date => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  return expirationDate;
};

export const isTokenExpired = (expiresAt: Date): boolean => {
  return expiresAt < new Date();
};

export const getExpirationStatus = (expiresAt: Date): 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON' => {
  const now = new Date();
  const timeUntilExpiry = expiresAt.getTime() - now.getTime();
  const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);

  if (timeUntilExpiry <= 0) {
    return 'EXPIRED';
  }

  if (hoursUntilExpiry <= 24) {
    return 'EXPIRING_SOON';
  }

  return 'ACTIVE';
};

// Default onboarding checklist items
export const DEFAULT_ONBOARDING_CHECKLIST = {
  profileCompleted: false,
  emergencyContactAdded: false,
  bankDetailsProvided: false,
  termsAccepted: false,
} as const;

// Validation presets
export const ONBOARDING_VALIDATION_PRESETS = {
  SHORT_TERM: { days: 3, maxReminders: 2 },
  STANDARD: { days: 7, maxReminders: 3 },
  EXTENDED: { days: 14, maxReminders: 4 },
  LONG_TERM: { days: 30, maxReminders: 5 },
} as const;
