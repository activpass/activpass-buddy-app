import nodemailer from 'nodemailer';
import { Resend } from 'resend';

import { env } from '@/env';
import { logger } from '@/server/logger';

const isProd = process.env.NODE_ENV === 'production';

// Initialize Resend for production
const resend = isProd && env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// Initialize Nodemailer for development
const createNodemailerTransporter = async () => {
  const account = await nodemailer.createTestAccount();
  if (process.env.NODE_ENV === 'development') {
    const port = parseInt(env.SMTP_PORT || '587', 10);
    return nodemailer.createTransport({
      host: env.SMTP_HOST || account.smtp.host,
      port: parseInt(env.SMTP_PORT || '', 10) || account.smtp.port,
      secure: env.SMTP_HOST ? port === 465 : account.smtp.secure, // true for 465, false for other ports
      auth:
        env.SMTP_USER && env.SMTP_PASS
          ? {
              user: env.SMTP_USER,
              pass: env.SMTP_PASS,
            }
          : {
              user: account.user,
              pass: account.pass,
            },
      // For development, you might want to use Ethereal Email or similar service
      // If no SMTP credentials are provided, this will try to connect to a local SMTP server
    });
  }
  return null;
};

const nodemailerTransporter = await createNodemailerTransporter();

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export const sendMail = async (
  options: EmailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const { to, subject, html, text, from, attachments } = options;

  // Ensure we have either HTML or text content
  if (!html && !text) {
    throw new Error('Either html or text content must be provided');
  }

  const fromAddress = from || env.FROM_EMAIL;
  const recipients = Array.isArray(to) ? to : [to];

  try {
    if (isProd && resend) {
      // Use Resend for production
      const data = await resend.emails.send({
        from: fromAddress,
        to: recipients,
        subject,
        html: html || text || '',
        text,
        attachments: attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
        })),
      });

      if (data.error) {
        const errorMessage = data.error.message || 'Failed to send email';
        logger.error(`Error sending email via Resend: ${errorMessage}`);
        return {
          success: false,
        };
      }

      logger.info(`Email sent via Resend: ${data.data?.id || 'unknown ID'}`);

      return {
        success: true,
        messageId: data.data?.id,
      };
    }

    if (process.env.NODE_ENV === 'development' && nodemailerTransporter) {
      // Use Nodemailer for development
      const info = await nodemailerTransporter.sendMail({
        from: fromAddress,
        to: recipients.join(', '),
        subject,
        html,
        text,
        attachments: attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        })),
      });

      logger.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      return {
        success: true,
        messageId: info.messageId,
      };
    }

    // Fallback: Return success when no service is configured
    return {
      success: true,
      messageId: `dev-${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Utility function to send a simple text email
export const sendTextEmail = async (
  to: string | string[],
  subject: string,
  text: string,
  from?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  return sendMail({ to, subject, text, from });
};

// Utility function to send an HTML email
export const sendHtmlEmail = async (
  to: string | string[],
  subject: string,
  html: string,
  from?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  return sendMail({ to, subject, html, from });
};
