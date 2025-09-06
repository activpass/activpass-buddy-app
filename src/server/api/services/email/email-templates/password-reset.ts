import { env } from '@/env';

import { getBaseEmailTemplate } from './base-template';

export interface PasswordResetEmailProps {
  username: string;
  email: string;
  resetToken: string;
  resetUrl?: string;
  expirationHours?: number;
}

export const generatePasswordResetEmail = (props: PasswordResetEmailProps) => {
  const {
    username,
    email,
    resetToken,
    resetUrl = `${env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`,
    expirationHours = 24,
  } = props;

  const baseTemplate = getBaseEmailTemplate({
    title: 'Reset Your Password - ActivPass',
    preheader: 'Someone requested a password reset for your ActivPass account.',
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    ${baseTemplate.head}
    <body>
      ${baseTemplate.preheader}
      <div class="email-wrapper">
        <div class="email-container">
          ${baseTemplate.header}
          
          <div class="email-content">
            <div class="email-greeting">
              Hello <strong>${username}</strong>,
            </div>
            
            <div class="email-text">
              We received a request to reset the password for your ActivPass account associated with <strong>${email}</strong>.
            </div>
            
            <div class="email-text">
              If you made this request, click the button below to reset your password:
            </div>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" target="_blank" class="email-button">
                Reset Password
              </a>
            </div>
            
            <div class="email-text">
              Or copy and paste this link into your browser:
            </div>
            
            <div class="email-link">
              ${resetUrl}
            </div>
            
            <div class="email-warning">
              <p class="email-warning-text">
                <strong>Important:</strong> This password reset link will expire in ${expirationHours} hours. 
                If you don't reset your password within this time, you'll need to request a new reset link.
              </p>
            </div>
            
            <hr class="email-divider">
            
            <div class="email-text">
              <strong>Didn't request this?</strong><br>
              If you didn't request a password reset, you can safely ignore this email. 
              Your password will not be changed, and your account remains secure.
            </div>
            
            <div class="email-text">
              For security reasons, this link can only be used once. If you need to reset your password again, 
              you'll need to make a new request.
            </div>
          </div>
          
          ${baseTemplate.footer}
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Reset Your Password - ActivPass

Hello ${username},

We received a request to reset the password for your ActivPass account associated with ${email}.

If you made this request, visit the following link to reset your password:
${resetUrl}

IMPORTANT: This password reset link will expire in ${expirationHours} hours. If you don't reset your password within this time, you'll need to request a new reset link.

Didn't request this?
If you didn't request a password reset, you can safely ignore this email. Your password will not be changed, and your account remains secure.

For security reasons, this link can only be used once. If you need to reset your password again, you'll need to make a new request.

---
This email was sent by ActivPass. If you have any questions, please contact our support team.
Visit: ${env.NEXT_PUBLIC_APP_URL}
  `;

  return {
    html: htmlContent,
    text: textContent,
  };
};
