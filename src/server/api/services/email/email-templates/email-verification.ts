import { env } from '@/env';

import { getBaseEmailTemplate } from './base-template';

export interface EmailVerificationProps {
  username: string;
  email: string;
  verificationToken: string;
  verificationUrl?: string;
}

export const generateEmailVerificationEmail = (props: EmailVerificationProps) => {
  const {
    username,
    email,
    verificationToken,
    verificationUrl = `${env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`,
  } = props;

  const baseTemplate = getBaseEmailTemplate({
    title: 'Verify Your Email - ActivPass',
    preheader: 'Welcome to ActivPass! Please verify your email address to get started.',
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
              Welcome to ActivPass, <strong>${username}</strong>! 🎉
            </div>
            
            <div class="email-text">
              Thank you for signing up with ActivPass. To complete your registration and access your account, 
              please verify your email address <strong>${email}</strong>.
            </div>
            
            <div class="email-text">
              Click the button below to verify your email address:
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationUrl}" target="_blank" class="email-button">
                Verify Email Address
              </a>
            </div>
            
            <div class="email-text">
              Or copy and paste this link into your browser:
            </div>
            
            <div class="email-link">
              ${verificationUrl}
            </div>
            
            <hr class="email-divider">
            
            <div class="email-text">
              <strong>What's next?</strong><br>
              After verifying your email, you'll be able to:
            </div>
            
            <div class="email-text">
              • Complete your profile setup<br>
              • Set up your facility information<br>
              • Start managing your activities with ActivPass
            </div>
            
            <div class="email-text">
              <strong>Didn't sign up?</strong><br>
              If you didn't create an account with ActivPass, you can safely ignore this email. 
              No account will be created, and your email address will not be used.
            </div>
          </div>
          
          ${baseTemplate.footer}
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Welcome to ActivPass!

Hello ${username},

Thank you for signing up with ActivPass. To complete your registration and access your account, please verify your email address ${email}.

Visit the following link to verify your email address:
${verificationUrl}

What's next?
After verifying your email, you'll be able to:
• Complete your profile setup
• Set up your facility information  
• Start managing your activities with ActivPass

Didn't sign up?
If you didn't create an account with ActivPass, you can safely ignore this email. No account will be created, and your email address will not be used.

---
This email was sent by ActivPass. If you have any questions, please contact our support team.
Visit: ${env.NEXT_PUBLIC_APP_URL}
  `;

  return {
    html: htmlContent,
    text: textContent,
  };
};
