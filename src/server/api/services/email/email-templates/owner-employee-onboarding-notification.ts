import { env } from '@/env';

import { getBaseEmailTemplate } from './base-template';

export interface OwnerEmployeeOnboardingNotificationProps {
  ownerName: string;
  ownerEmail: string;
  employeeName: string;
  employeeEmail: string;
  organizationName: string;
  onboardingCompletedAt: string;
  jobTitle?: string;
  dashboardUrl?: string;
}

export const generateOwnerEmployeeOnboardingNotificationEmail = (
  props: OwnerEmployeeOnboardingNotificationProps
) => {
  const {
    ownerName,
    employeeName,
    employeeEmail,
    organizationName,
    onboardingCompletedAt,
    jobTitle,
    dashboardUrl = `${env.NEXT_PUBLIC_APP_URL}/employees`,
  } = props;

  const baseTemplate = getBaseEmailTemplate({
    title: `New Employee Onboarded - ${employeeName}`,
    preheader: `${employeeName} has successfully completed their employee onboarding for ${organizationName}.`,
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
              Hello <strong>${ownerName}</strong>,
            </div>
            
            <div class="email-text">
              Great news! <strong>${employeeName}</strong> has successfully completed their employee onboarding 
              process for <strong>${organizationName}</strong>.
            </div>
            
            <div style="background-color: #f0fdf4; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #22c55e;">
              <div class="email-text" style="margin-bottom: 16px;">
                <strong>✅ Onboarding Complete - Employee Details:</strong>
              </div>
              <div class="email-text">
                • <strong>Employee Name:</strong> ${employeeName}<br>
                • <strong>Email:</strong> ${employeeEmail}<br>
                ${jobTitle ? `• <strong>Position:</strong> ${jobTitle}<br>` : ''}
                • <strong>Organization:</strong> ${organizationName}<br>
                • <strong>Completed:</strong> ${onboardingCompletedAt}<br>
                • <strong>Status:</strong> ✅ Ready to Start
              </div>
            </div>
            
            <div class="email-text">
              The new employee has provided all required information including:
            </div>
            
            <div class="email-text">
              • Personal and contact information<br>
              • Emergency contact details<br>
              • Banking information for payroll<br>
              • Job preferences and availability<br>
              • Work schedule preferences
            </div>
            
            <div class="email-text">
              <strong>Next Steps:</strong>
            </div>
            
            <div class="email-text">
              • Review the employee's profile and information<br>
              • Assign roles and permissions as needed<br>
              • Set up work schedules and duties<br>
              • Provide any additional training or orientation<br>
              • Welcome them to the team!
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${dashboardUrl}" target="_blank" class="email-button">
                View Employee Profile
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
              <strong>💡 Management Tips:</strong>
            </div>
            
            <div class="email-text">
              • Schedule a welcome meeting or introduction session<br>
              • Ensure all necessary access and tools are provided<br>
              • Consider assigning a mentor or buddy for the first few days<br>
              • Set clear expectations and goals for the initial period
            </div>
            
            <div class="email-text">
              <strong>Questions or need assistance?</strong><br>
              If you need help managing your new employee or have questions about the onboarding process, 
              our support team is here to help.
            </div>
          </div>
          
          ${baseTemplate.footer}
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
New Employee Onboarded - ${employeeName}

Hello ${ownerName},

Great news! ${employeeName} has successfully completed their employee onboarding process for ${organizationName}.

✅ Onboarding Complete - Employee Details:
• Employee Name: ${employeeName}
• Email: ${employeeEmail}
${jobTitle ? `• Position: ${jobTitle}` : ''}
• Organization: ${organizationName}
• Completed: ${onboardingCompletedAt}
• Status: ✅ Ready to Start

The new employee has provided all required information including:
• Personal and contact information
• Emergency contact details
• Banking information for payroll
• Job preferences and availability
• Work schedule preferences

Next Steps:
• Review the employee's profile and information
• Assign roles and permissions as needed
• Set up work schedules and duties
• Provide any additional training or orientation
• Welcome them to the team!

View Employee Profile: ${dashboardUrl}

💡 Management Tips:
• Schedule a welcome meeting or introduction session
• Ensure all necessary access and tools are provided
• Consider assigning a mentor or buddy for the first few days
• Set clear expectations and goals for the initial period

Questions or need assistance?
If you need help managing your new employee or have questions about the onboarding process, our support team is here to help.

---
This email was sent by ActivPass for ${organizationName}.
Visit: ${env.NEXT_PUBLIC_APP_URL}
  `;

  return {
    html: htmlContent,
    text: textContent,
  };
};
