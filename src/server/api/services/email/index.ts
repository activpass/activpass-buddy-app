export {
  sendEmailVerificationEmail,
  sendOnboardingCompletionEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendWelcomeEmail,
} from './email.service';
export type {
  EmailVerificationProps,
  OnboardingCompletionEmailProps,
  PasswordResetEmailProps,
  PasswordResetSuccessEmailProps,
} from './email-templates';
