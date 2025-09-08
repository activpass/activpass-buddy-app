import { env } from '@/env';

import { getBaseEmailTemplate } from './base-template';

export interface NewMemberNotificationEmailProps {
  organizationOwnerName: string;
  organizationOwnerEmail: string;
  organizationName: string;
  organizationType: string;
  clientName: string;
  clientEmail: string;
  membershipPlanName: string;
  joinDate: string;
  dashboardUrl?: string;
}

export const generateNewMemberNotificationEmail = (props: NewMemberNotificationEmailProps) => {
  const {
    organizationOwnerName,
    organizationOwnerEmail,
    organizationName,
    organizationType,
    clientName,
    clientEmail,
    membershipPlanName,
    joinDate,
    dashboardUrl = `${env.NEXT_PUBLIC_APP_URL}/clients`,
  } = props;

  const baseTemplate = getBaseEmailTemplate({
    title: 'New Member Joined Your Organization!',
    preheader: `${clientName} has successfully joined ${organizationName}. View member details in your dashboard.`,
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
              Great news, <strong>${organizationOwnerName}</strong>! 🎉
            </div>
            
            <div class="email-text">
              A new member has successfully joined <strong>${organizationName}</strong>! 
              Your ${organizationType.toLowerCase()} community is growing.
            </div>
            
            <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <div class="email-text" style="margin-bottom: 16px;">
                <strong>👤 New Member Details:</strong>
              </div>
              <div class="email-text">
                • <strong>Member Name:</strong> ${clientName}<br>
                • <strong>Email:</strong> ${clientEmail}<br>
                • <strong>Membership Plan:</strong> ${membershipPlanName}<br>
                • <strong>Join Date:</strong> ${joinDate}<br>
                • <strong>Status:</strong> ✅ Active
              </div>
            </div>
            
            <div class="email-text">
              <strong>Next Steps:</strong><br>
              Here's what you can do to welcome your new member:
            </div>
            
            <div class="email-text">
              • <strong>Review member profile</strong> - Check their preferences and goals<br>
              • <strong>Send a welcome message</strong> - Reach out personally to welcome them<br>
              • <strong>Schedule orientation</strong> - Help them get familiar with facilities<br>
              • <strong>Assign a trainer</strong> - Provide guidance for their fitness journey<br>
              • <strong>Update member records</strong> - Ensure all information is complete
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${dashboardUrl}" target="_blank" class="email-button">
                View Member in Dashboard
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
              <strong>📊 Member Management Tips:</strong>
            </div>
            
            <div class="email-text">
              1. <strong>Personalized onboarding</strong> - Create a welcoming experience<br>
              2. <strong>Regular check-ins</strong> - Monitor progress and satisfaction<br>
              3. <strong>Facility orientation</strong> - Show them around and explain policies<br>
              4. <strong>Goal setting</strong> - Help them establish and track fitness goals
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <div class="email-text">
                <strong>💡 Pro Tip:</strong> New members are most likely to stay engaged in their first 30 days. 
                Consider reaching out personally to ensure they have a great experience!
              </div>
            </div>
            
            <div class="email-text">
              <strong>Organization Summary:</strong><br>
              • <strong>${organizationType}:</strong> ${organizationName}<br>
              • <strong>Owner:</strong> ${organizationOwnerName}<br>
              • <strong>Contact:</strong> ${organizationOwnerEmail}
            </div>
            
            <div class="email-text">
              Keep up the great work growing your ${organizationType.toLowerCase()} community!
            </div>
          </div>
          
          ${baseTemplate.footer}
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
New Member Joined Your Organization!

Great news, ${organizationOwnerName}!

A new member has successfully joined ${organizationName}! Your ${organizationType.toLowerCase()} community is growing.

👤 New Member Details:
• Member Name: ${clientName}
• Email: ${clientEmail}
• Membership Plan: ${membershipPlanName}
• Join Date: ${joinDate}
• Status: ✅ Active

Next Steps:
Here's what you can do to welcome your new member:
• Review member profile - Check their preferences and goals
• Send a welcome message - Reach out personally to welcome them
• Schedule orientation - Help them get familiar with facilities
• Assign a trainer - Provide guidance for their fitness journey
• Update member records - Ensure all information is complete

View member in dashboard: ${dashboardUrl}

📊 Member Management Tips:
1. Personalized onboarding - Create a welcoming experience
2. Regular check-ins - Monitor progress and satisfaction
3. Facility orientation - Show them around and explain policies
4. Goal setting - Help them establish and track fitness goals

💡 Pro Tip: New members are most likely to stay engaged in their first 30 days. Consider reaching out personally to ensure they have a great experience!

Organization Summary:
• ${organizationType}: ${organizationName}
• Owner: ${organizationOwnerName}
• Contact: ${organizationOwnerEmail}

Keep up the great work growing your ${organizationType.toLowerCase()} community!

---
This email was sent by ActivPass to notify you of new member activity. 
Visit: ${env.NEXT_PUBLIC_APP_URL}
  `;

  return {
    html: htmlContent,
    text: textContent,
  };
};
