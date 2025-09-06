import { sendMail } from '@/lib/resend';

import {
  type EmailVerificationProps,
  generateEmailVerificationEmail,
  generateOnboardingCompletionEmail,
  generatePasswordResetEmail,
  generatePasswordResetSuccessEmail,
  type OnboardingCompletionEmailProps,
  type PasswordResetEmailProps,
  type PasswordResetSuccessEmailProps,
} from './email-templates';

/**
 * Sends an email verification email to the user
 */
export const sendEmailVerificationEmail = async (props: EmailVerificationProps) => {
  const { email } = props;
  const { html, text } = generateEmailVerificationEmail(props);

  const result = await sendMail({
    to: email,
    subject: 'Verify Your Email - ActivPass',
    html,
    text,
  });

  return result;
};

/**
 * Sends a password reset email to the user
 */
export const sendPasswordResetEmail = async (props: PasswordResetEmailProps) => {
  const { email } = props;
  const { html, text } = generatePasswordResetEmail(props);

  const result = await sendMail({
    to: email,
    subject: 'Reset Your ActivPass Password',
    html,
    text,
  });

  return result;
};

/**
 * Sends a password reset success notification email to the user
 */
export const sendPasswordResetSuccessEmail = async (props: PasswordResetSuccessEmailProps) => {
  const { email } = props;
  const { html, text } = generatePasswordResetSuccessEmail(props);

  const result = await sendMail({
    to: email,
    subject: 'Password Reset Successful - ActivPass',
    html,
    text,
  });

  return result;
};

/**
 * Sends an onboarding completion email to the user
 */
export const sendOnboardingCompletionEmail = async (props: OnboardingCompletionEmailProps) => {
  const { email } = props;
  const { html, text } = generateOnboardingCompletionEmail(props);

  const result = await sendMail({
    to: email,
    subject: 'Welcome to ActivPass - Setup Complete!',
    html,
    text,
  });

  return result;
};

/**
 * Sends a welcome email to new users
 */
export const sendWelcomeEmail = async (username: string, email: string) => {
  // For now, this is a simple implementation
  // You can create a dedicated welcome email template later
  const result = await sendMail({
    to: email,
    subject: 'Welcome to ActivPass!',
    html: `
      <h1>Welcome ${username}!</h1>
      <p>Thank you for joining ActivPass. We're excited to have you on board!</p>
      <p>You can now access your account and start managing your activities.</p>
      <p>Best regards,<br>The ActivPass Team</p>
    `,
    text: `
Welcome ${username}!

Thank you for joining ActivPass. We're excited to have you on board!

You can now access your account and start managing your activities.

Best regards,
The ActivPass Team
    `,
  });

  return result;
};
