import { env } from '@/env';

import { getBaseEmailTemplate } from './base-template';

export interface EmployeeOnboardingSuccessProps {
  employeeName: string;
  employeeEmail: string;
  organizationName: string;
  dashboardUrl?: string;
  jobTitle?: string;
  startDate?: string;
}

export const generateEmployeeOnboardingSuccessEmail = (props: EmployeeOnboardingSuccessProps) => {
  const {
    employeeName,
    employeeEmail,
    organizationName,
    dashboardUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
    jobTitle,
    startDate,
  } = props;

  const baseTemplate = getBaseEmailTemplate({
    title: `Welcome to ${organizationName} - Onboarding Complete!`,
    preheader: 'Your employee onboarding is complete. Welcome to the team!',
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
              Welcome to the team, <strong>${employeeName}</strong>! 🎉
            </div>
            
            <div class="email-text">
              Congratulations! Your employee onboarding for <strong>${organizationName}</strong> has been successfully completed. 
              We're excited to have you as part of our team!
            </div>
            
            <div style="background-color: #f0f9ff; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #3b82f6;">
              <div class="email-text" style="margin-bottom: 16px;">
                <strong>📋 Your Employment Details:</strong>
              </div>
              <div class="email-text">
                • <strong>Employee Name:</strong> ${employeeName}<br>
                • <strong>Email:</strong> ${employeeEmail}<br>
                • <strong>Organization:</strong> ${organizationName}<br>
                ${jobTitle ? `• <strong>Position:</strong> ${jobTitle}<br>` : ''}
                ${startDate ? `• <strong>Start Date:</strong> ${startDate}<br>` : ''}
                • <strong>Status:</strong> ✅ Onboarding Complete
              </div>
            </div>
            
            <div class="email-text">
              <strong>What's next?</strong>
            </div>
            
            <div class="email-text">
              • You will receive further instructions from your manager or HR team<br>
              • Check your work schedule and assigned duties<br>
              • Access company resources and systems as needed<br>
              • Meet with your team members and supervisors<br>
              • Complete any remaining orientation activities
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${dashboardUrl}" target="_blank" class="email-button">
                Access Employee Portal
              </a>
            </div>
            
            <div class="email-text">
              Or copy and paste this link into your browser:
            </div>
            
            <div class="email-link">
              ${dashboardUrl}
            </div>
            
            <hr class="email-divider">
            
            <div class="email-text">
              <strong>🏢 Important Reminders:</strong>
            </div>
            
            <div class="email-text">
              • Keep your contact information up to date<br>
              • Review company policies and procedures<br>
              • Don't hesitate to ask questions - we're here to help!<br>
              • Check your email regularly for important updates
            </div>
            
            <div class="email-text">
              <strong>Need help or have questions?</strong><br>
              Please contact your supervisor, HR department, or reach out to our support team. 
              We want to ensure you have everything you need to succeed in your new role!
            </div>
            
            <div class="email-text">
              Once again, welcome to <strong>${organizationName}</strong>! We look forward to working with you.
            </div>
          </div>
          
          ${baseTemplate.footer}
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Welcome to ${organizationName} - Onboarding Complete!

Welcome to the team, ${employeeName}!

Congratulations! Your employee onboarding for ${organizationName} has been successfully completed. We're excited to have you as part of our team!

📋 Your Employment Details:
• Employee Name: ${employeeName}
• Email: ${employeeEmail}
• Organization: ${organizationName}
${jobTitle ? `• Position: ${jobTitle}` : ''}
${startDate ? `• Start Date: ${startDate}` : ''}
• Status: ✅ Onboarding Complete

What's next?
• You will receive further instructions from your manager or HR team
• Check your work schedule and assigned duties
• Access company resources and systems as needed
• Meet with your team members and supervisors
• Complete any remaining orientation activities

Access Employee Portal: ${dashboardUrl}

🏢 Important Reminders:
• Keep your contact information up to date
• Review company policies and procedures
• Don't hesitate to ask questions - we're here to help!
• Check your email regularly for important updates

Need help or have questions?
Please contact your supervisor, HR department, or reach out to our support team. We want to ensure you have everything you need to succeed in your new role!

Once again, welcome to ${organizationName}! We look forward to working with you.

---
This email was sent by ActivPass on behalf of ${organizationName}.
Visit: ${env.NEXT_PUBLIC_APP_URL}
  `;

  return {
    html: htmlContent,
    text: textContent,
  };
};
