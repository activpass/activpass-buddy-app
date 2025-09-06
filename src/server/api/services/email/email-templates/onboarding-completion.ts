import { env } from '@/env';

import { getBaseEmailTemplate } from './base-template';

export interface OnboardingCompletionEmailProps {
  username: string;
  email: string;
  facilityName: string;
  businessType: string;
  dashboardUrl?: string;
}

export const generateOnboardingCompletionEmail = (props: OnboardingCompletionEmailProps) => {
  const {
    username,
    email,
    facilityName,
    businessType,
    dashboardUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
  } = props;

  const baseTemplate = getBaseEmailTemplate({
    title: 'Welcome to ActivPass - Setup Complete!',
    preheader: 'Your facility profile is ready. Start managing your activities now!',
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
              Congratulations, <strong>${username}</strong>! 🎉
            </div>
            
            <div class="email-text">
              Your ActivPass account setup is now complete! Your facility <strong>"${facilityName}"</strong> 
              has been successfully registered and is ready to start managing activities.
            </div>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin: 24px 0;">
              <div class="email-text" style="margin-bottom: 16px;">
                <strong>📋 Your Setup Summary:</strong>
              </div>
              <div class="email-text">
                • <strong>Facility Name:</strong> ${facilityName}<br>
                • <strong>Business Type:</strong> ${businessType}<br>
                • <strong>Account Email:</strong> ${email}<br>
                • <strong>Status:</strong> ✅ Active & Ready
              </div>
            </div>
            
            <div class="email-text">
              You can now access your dashboard to:
            </div>
            
            <div class="email-text">
              • Set up your activity programs and schedules<br>
              • Manage member registrations and check-ins<br>
              • Track attendance and generate reports<br>
              • Configure facility settings and preferences<br>
              • Add team members and manage permissions
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${dashboardUrl}" target="_blank" class="email-button">
                Access Your Dashboard
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
              <strong>🚀 Getting Started Tips:</strong>
            </div>
            
            <div class="email-text">
              1. <strong>Explore your dashboard</strong> - Familiarize yourself with the main features<br>
              2. <strong>Set up your first activity</strong> - Create programs that members can join<br>
              3. <strong>Customize your profile</strong> - Add your facility's branding and information<br>
              4. <strong>Invite team members</strong> - Add staff to help manage your facility
            </div>
            
            <div class="email-text">
              <strong>Need help getting started?</strong><br>
              Our support team is here to help you make the most of ActivPass. 
              Don't hesitate to reach out if you have any questions!
            </div>
          </div>
          
          ${baseTemplate.footer}
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Welcome to ActivPass - Setup Complete!

Congratulations, ${username}!

Your ActivPass account setup is now complete! Your facility "${facilityName}" has been successfully registered and is ready to start managing activities.

📋 Your Setup Summary:
• Facility Name: ${facilityName}
• Business Type: ${businessType}
• Account Email: ${email}
• Status: ✅ Active & Ready

You can now access your dashboard to:
• Set up your activity programs and schedules
• Manage member registrations and check-ins
• Track attendance and generate reports
• Configure facility settings and preferences
• Add team members and manage permissions

Access your dashboard: ${dashboardUrl}

🚀 Getting Started Tips:
1. Explore your dashboard - Familiarize yourself with the main features
2. Set up your first activity - Create programs that members can join
3. Customize your profile - Add your facility's branding and information
4. Invite team members - Add staff to help manage your facility

Need help getting started?
Our support team is here to help you make the most of ActivPass. Don't hesitate to reach out if you have any questions!

---
This email was sent by ActivPass. If you have any questions, please contact our support team.
Visit: ${env.NEXT_PUBLIC_APP_URL}
  `;

  return {
    html: htmlContent,
    text: textContent,
  };
};
