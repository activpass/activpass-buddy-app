import { logger } from '@/server/logger';

import { sendHtmlEmail, sendMail, sendTextEmail } from '../../../../../lib/resend';

// Example usage of the email service

// Basic example with HTML content
export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const result = await sendHtmlEmail(
    userEmail,
    'Welcome to ActivPass!',
    `
    <h1>Welcome ${userName}!</h1>
    <p>Thank you for joining ActivPass. We're excited to have you on board!</p>
    <p>Best regards,<br>The ActivPass Team</p>
    `
  );

  if (!result.success) {
    logger.error('Failed to send welcome email:', result.error);
  }

  return result;
};

// Example with plain text
export const sendPasswordResetEmail = async (userEmail: string, resetToken: string) => {
  const result = await sendTextEmail(
    userEmail,
    'Password Reset Request',
    `
    Hello,

    You have requested a password reset for your ActivPass account.
    
    Reset Token: ${resetToken}
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    The ActivPass Team
    `
  );

  if (!result.success) {
    logger.error('Failed to send password reset email:', result.error);
  }

  return result;
};

// Advanced example with attachments
export const sendInvoiceEmail = async (
  userEmail: string,
  invoiceData: { number: string; amount: string },
  pdfBuffer: Buffer
) => {
  const result = await sendMail({
    to: userEmail,
    subject: `Invoice ${invoiceData.number} - ActivPass`,
    html: `
    <h2>Invoice ${invoiceData.number}</h2>
    <p>Dear Customer,</p>
    <p>Please find attached your invoice for the amount of ${invoiceData.amount}.</p>
    <p>Thank you for your business!</p>
    <p>Best regards,<br>The ActivPass Team</p>
    `,
    attachments: [
      {
        filename: `invoice-${invoiceData.number}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  if (!result.success) {
    logger.error('Failed to send invoice email:', result.error);
  }

  return result;
};

// Example sending to multiple recipients
export const sendNotificationEmail = async (recipients: string[], message: string) => {
  const result = await sendMail({
    to: recipients,
    subject: 'ActivPass Notification',
    html: `
    <h2>Notification</h2>
    <p>${message}</p>
    <p>Best regards,<br>The ActivPass Team</p>
    `,
    text: `Notification: ${message}\n\nBest regards,\nThe ActivPass Team`,
  });

  if (!result.success) {
    logger.error('Failed to send notification email:', result.error);
  }

  return result;
};
