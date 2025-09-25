import { env } from '@/env';

import { getBaseEmailTemplate } from './base-template';

export interface EmployeeOnboardingProps {
  recipientEmail: string;
  organizationName: string;
  onboardingUrl: string;
  organizationOwnerName?: string;
  customMessage?: string;
  expirationDays?: number;
}

export const generateEmployeeOnboardingEmail = (props: EmployeeOnboardingProps) => {
  const {
    organizationName,
    onboardingUrl,
    organizationOwnerName,
    customMessage,
    expirationDays = 7,
  } = props;

  const baseTemplate = getBaseEmailTemplate({
    title: `Welcome to ${organizationName} - Complete Your Onboarding`,
    preheader: `You've been invited to join ${organizationName}. Complete your employee onboarding to get started.`,
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
              Welcome to <strong>${organizationName}</strong>! 🎉
            </div>
            
            <div class="email-text">
              ${organizationOwnerName ? `<strong>${organizationOwnerName}</strong> has` : 'You have been'} invited you to join <strong>${organizationName}</strong> as an employee. 
              We're excited to have you on our team!
            </div>
            
            ${
              customMessage
                ? `
            <div class="email-text">
              <strong>Personal Message:</strong><br>
              "${customMessage}"
            </div>
            `
                : ''
            }
            
            <div class="email-text">
              To complete your employee profile and get started, please click the button below to fill out your onboarding form:
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${onboardingUrl}" target="_blank" class="email-button">
                Complete Employee Onboarding
              </a>
            </div>
            
            <div class="email-text">
              Or copy and paste this link into your browser:
            </div>
            
            <div class="email-link">
              ${onboardingUrl}
            </div>
            
            <div class="email-warning">
              <div class="email-warning-text">
                <strong>⏰ Important:</strong> This onboarding link will expire in ${expirationDays} days for security reasons. 
                Please complete your onboarding as soon as possible.
              </div>
            </div>
            
            <hr class="email-divider">
            
            <div class="email-text">
              <strong>What information will you need to provide?</strong>
            </div>
            
            <div class="email-text">
              • Personal information (name, contact details, address)<br>
              • Emergency contact information<br>
              • Banking details for payroll<br>
              • Job-related preferences and details<br>
              • Work schedule and availability
            </div>
            
            <div class="email-text">
              <strong>Need help?</strong><br>
              If you have any questions about the onboarding process or need assistance, 
              please don't hesitate to contact ${organizationOwnerName || 'your organization administrator'} 
              or reach out to our support team.
            </div>
            
            <div class="email-text">
              <strong>Didn't expect this invitation?</strong><br>
              If you weren't expecting this invitation, please contact ${organizationName} directly to clarify. 
              You can safely ignore this email if you don't wish to proceed.
            </div>
          </div>
          
          ${baseTemplate.footer}
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Welcome to ${organizationName}!

${organizationOwnerName ? `${organizationOwnerName} has` : 'You have been'} invited you to join ${organizationName} as an employee. We're excited to have you on our team!

${customMessage ? `Personal Message: "${customMessage}"` : ''}

To complete your employee profile and get started, please visit the following link to fill out your onboarding form:

${onboardingUrl}

⏰ IMPORTANT: This onboarding link will expire in ${expirationDays} days for security reasons. Please complete your onboarding as soon as possible.

What information will you need to provide?
• Personal information (name, contact details, address)
• Emergency contact information
• Banking details for payroll
• Job-related preferences and details
• Work schedule and availability

Need help?
If you have any questions about the onboarding process or need assistance, please don't hesitate to contact ${organizationOwnerName || 'your organization administrator'} or reach out to our support team.

Didn't expect this invitation?
If you weren't expecting this invitation, please contact ${organizationName} directly to clarify. You can safely ignore this email if you don't wish to proceed.

---
This email was sent by ActivPass on behalf of ${organizationName}. If you have any questions, please contact our support team.
Visit: ${env.NEXT_PUBLIC_APP_URL}
  `;

  return {
    html: htmlContent,
    text: textContent,
  };
};
