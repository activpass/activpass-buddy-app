import { env } from '@/env';

import { getBaseEmailTemplate } from './base-template';

export interface PasswordResetSuccessEmailProps {
  username: string;
  email: string;
  resetDate?: Date;
}

export const generatePasswordResetSuccessEmail = (props: PasswordResetSuccessEmailProps) => {
  const { username, email, resetDate = new Date() } = props;

  const baseTemplate = getBaseEmailTemplate({
    title: 'Password Reset Successful - ActivPass',
    preheader: 'Your ActivPass password has been successfully reset.',
  });

  const formattedDate = resetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
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
              Hello ${username},
            </div>
            
            <div class="email-text">
              Your password for the ActivPass account associated with <strong>${email}</strong> has been successfully reset.
            </div>
            
            <div class="email-text">
              <strong>Reset completed:</strong> ${formattedDate}
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${env.NEXT_PUBLIC_APP_URL}/signin" target="_blank" class="email-button">
                Sign In to Your Account
              </a>
            </div>
            
            <div class="email-warning">
              <p class="email-warning-text">
                <strong>Security Notice:</strong> If you did not reset your password, please contact our support team immediately. 
                Your account security is important to us.
              </p>
            </div>
            
            <hr class="email-divider">
            
            <div class="email-text">
              <strong>Tips for keeping your account secure:</strong>
            </div>
            
            <div class="email-text">
              • Use a strong, unique password that you don't use for other accounts<br>
              • Enable two-factor authentication when available<br>
              • Never share your password with anyone<br>
              • Sign out of public or shared devices after use
            </div>
            
            <div class="email-text">
              If you have any questions or concerns about your account security, 
              please don't hesitate to contact our support team.
            </div>
          </div>
          
          ${baseTemplate.footer}
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Password Reset Successful - ActivPass

Hello ${username},

Your password for the ActivPass account associated with ${email} has been successfully reset.

Reset completed: ${formattedDate}

You can now sign in to your account using your new password:
${env.NEXT_PUBLIC_APP_URL}/signin

SECURITY NOTICE: If you did not reset your password, please contact our support team immediately. Your account security is important to us.

Tips for keeping your account secure:
• Use a strong, unique password that you don't use for other accounts
• Enable two-factor authentication when available
• Never share your password with anyone
• Sign out of public or shared devices after use

If you have any questions or concerns about your account security, please don't hesitate to contact our support team.

---
This email was sent by ActivPass. If you have any questions, please contact our support team.
Visit: ${env.NEXT_PUBLIC_APP_URL}
  `;

  return {
    html: htmlContent,
    text: textContent,
  };
};
