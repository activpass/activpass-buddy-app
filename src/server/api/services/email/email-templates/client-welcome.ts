import { env } from '@/env';

import { getBaseEmailTemplate } from './base-template';

export interface ClientWelcomeEmailProps {
  clientId: string;
  orgId: string;
  clientName: string;
  clientEmail: string;
  organizationName: string;
  organizationType: string;
  membershipPlanName: string;
  dashboardUrl?: string;
}

export const generateClientWelcomeEmail = (props: ClientWelcomeEmailProps) => {
  const {
    clientName,
    clientEmail,
    organizationName,
    organizationType,
    membershipPlanName,
    clientId,
    orgId,
    dashboardUrl = `${env.NEXT_PUBLIC_APP_URL}/client-dashboard?clientId=${clientId}&organizationId=${orgId}`,
  } = props;

  const baseTemplate = getBaseEmailTemplate({
    title: `Welcome to ${organizationName}!`,
    preheader: `You've successfully joined ${organizationName}. Your membership is now active!`,
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
              Welcome to ${organizationName}, <strong>${clientName}</strong>! 🎉
            </div>
            
            <div class="email-text">
              Congratulations! You have successfully joined <strong>${organizationName}</strong> 
              as a new member. We're excited to have you as part of our ${organizationType.toLowerCase()} community!
            </div>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin: 24px 0;">
              <div class="email-text" style="margin-bottom: 16px;">
                <strong>📋 Your Membership Details:</strong>
              </div>
              <div class="email-text">
                • <strong>Member Name:</strong> ${clientName}<br>
                • <strong>Email:</strong> ${clientEmail}<br>
                • <strong>${organizationType}:</strong> ${organizationName}<br>
                • <strong>Membership Plan:</strong> ${membershipPlanName}<br>
                • <strong>Status:</strong> ✅ Active
              </div>
            </div>
            
            <div class="email-text">
              <strong>What's next?</strong><br>
              You can now enjoy all the benefits of your membership:
            </div>
            
            <div class="email-text">
              • Access to all ${organizationType.toLowerCase()} facilities and equipment<br>
              • Participate in classes and activities<br>
              • Book sessions and manage your schedule<br>
              • Track your progress and achievements<br>
              • Connect with other members and trainers
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${dashboardUrl}" target="_blank" class="email-button">
                Access Your Member Portal
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
              1. <strong>Complete your profile</strong> - Add your preferences and goals<br>
              2. <strong>Book your first session</strong> - Schedule classes or training sessions<br>
              3. <strong>Explore facilities</strong> - Familiarize yourself with equipment and amenities<br>
              4. <strong>Connect with trainers</strong> - Get guidance on your fitness journey
            </div>
            
            <div class="email-text">
              <strong>Need help getting started?</strong><br>
              Our team at ${organizationName} is here to help you make the most of your membership. 
              Don't hesitate to reach out if you have any questions or need assistance!
            </div>
            
            <div class="email-text">
              We look forward to supporting you on your fitness journey!
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

Welcome, ${clientName}!

Congratulations! You have successfully joined ${organizationName} as a new member. We're excited to have you as part of our ${organizationType.toLowerCase()} community!

📋 Your Membership Details:
• Member Name: ${clientName}
• Email: ${clientEmail}
• ${organizationType}: ${organizationName}
• Membership Plan: ${membershipPlanName}
• Status: ✅ Active

What's next?
You can now enjoy all the benefits of your membership:
• Access to all ${organizationType.toLowerCase()} facilities and equipment
• Participate in classes and activities
• Book sessions and manage your schedule
• Track your progress and achievements
• Connect with other members and trainers

Access your member portal: ${dashboardUrl}

🚀 Getting Started Tips:
1. Complete your profile - Add your preferences and goals
2. Book your first session - Schedule classes or training sessions
3. Explore facilities - Familiarize yourself with equipment and amenities
4. Connect with trainers - Get guidance on your fitness journey

Need help getting started?
Our team at ${organizationName} is here to help you make the most of your membership. Don't hesitate to reach out if you have any questions or need assistance!

We look forward to supporting you on your fitness journey!

---
This email was sent by ActivPass on behalf of ${organizationName}. If you have any questions, please contact the facility directly.
Visit: ${env.NEXT_PUBLIC_APP_URL}
  `;

  return {
    html: htmlContent,
    text: textContent,
  };
};
