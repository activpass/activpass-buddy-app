import { env } from '@/env';

export interface BaseEmailProps {
  title: string;
  preheader?: string;
  logoUrl?: string;
  appName?: string;
  appUrl?: string;
  footerText?: string;
  unsubscribeUrl?: string;
}

export const getBaseEmailTemplate = (props: BaseEmailProps) => {
  const {
    title,
    preheader = '',
    logoUrl = `${env.NEXT_PUBLIC_APP_URL}/logos/png/activpass-buddy-logo-black-blue.png`,
    appName = 'ActivPass Buddy',
    appUrl = env.NEXT_PUBLIC_APP_URL,
    footerText = '',
    unsubscribeUrl = '',
  } = props;

  return {
    head: `
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>${title}</title>
      <style type="text/css" rel="stylesheet" media="all">
        /* Base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #374151;
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
        }
        
        .email-wrapper {
          background-color: #f9fafb;
          padding: 40px 20px;
          min-height: 100vh;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          padding: 30px 20px;
          text-align: center;
        }
        
        .email-logo { 
          max-width: 160px;
          height: auto;
        }
        
        .email-title {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .email-content {
          padding: 10px 20px;
        }
        
        .email-greeting {
          font-size: 18px;
          color: #111827;
          margin-bottom: 20px;
        }
        
        .email-text {
          font-size: 16px;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 24px;
        }
        
        .email-button {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: #ffffff !important;
          text-decoration: none;
          padding: 10px 30px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          margin: 0 24px 24px;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease;
        }
        
        .email-button:hover {
          box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.4);
        }
        
        .email-link {
          color: #3b82f6;
          text-decoration: none;
          word-break: break-all;
          padding: 12px 16px;
          background-color: #f3f4f6;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          display: block;
          margin: 16px 0;
        }
        
        .email-divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 32px 0;
          border: none;
        }
        
        .email-footer {
          background-color: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        .email-footer-text {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
        }
        
        .email-footer-links {
          font-size: 14px;
        }
        
        .email-footer-links a {
          color: #3b82f6;
          text-decoration: none;
          margin: 0 8px;
        }
        
        .email-warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 16px;
          margin: 24px 0;
        }
        
        .email-warning-text {
          font-size: 14px;
          color: #92400e;
          margin: 0;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          
          .email-container {
            border-radius: 8px;
          }
          
          .email-header,
          .email-content,
          .email-footer {
            padding: 24px 20px;
          }
          
          .email-title {
            font-size: 24px;
          }
          
          .email-button {
            display: block;
            width: 100%;
            text-align: center;
          }
        }
      </style>
    </head>`,

    header: `
    <div class="email-header">
      ${logoUrl ? `<img src="${logoUrl}" alt="${appName}" class="email-logo">` : ''}         
    </div>`,

    footer: `
    <div class="email-footer">
      <div class="email-footer-text">
        ${footerText || `This email was sent by ${appName}. If you have any questions, please contact our support team.`}
      </div>
      <div class="email-footer-links">
        <a href="${appUrl}" target="_blank">Visit Website</a>
        ${unsubscribeUrl ? `<a href="${unsubscribeUrl}" target="_blank">Unsubscribe</a>` : ''}
      </div>
    </div>`,

    preheader: preheader
      ? `<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">${preheader}</div>`
      : '',
  };
};
