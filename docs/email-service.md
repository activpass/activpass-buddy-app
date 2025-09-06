# ActivPass Email Service Documentation

This comprehensive email service provides password reset functionality with professional email templates for the ActivPass application.

## 🎯 What's Implemented

### ✅ Password Reset Email Frame

- **Professional HTML email template** with responsive design
- **Plain text fallback** for accessibility
- **Security warnings** and best practices messaging
- **Branded design** with ActivPass styling
- **Expiration notices** (24-hour default)
- **Mobile-responsive** layout

### ✅ Password Reset Success Email

- **Confirmation email** sent after successful password reset
- **Security tips** and account protection advice
- **Sign-in link** for immediate access
- **Timestamp** of when the reset occurred

### ✅ Email Verification Email

- **Welcome message** with verification link
- **Professional branding** with ActivPass styling
- **24-hour expiration** notice and clear instructions
- **Mobile-responsive** design

### ✅ Onboarding Completion Email

- **Congratulations message** with setup summary
- **Facility information** and account status
- **Getting started tips** and feature overview
- **Direct dashboard access** link

### ✅ Email Service Integration

- **Environment-based routing** (Nodemailer for dev, Resend for prod)
- **Comprehensive error handling** with logging
- **Security considerations** (no email enumeration)
- **TypeScript support** with full type safety

## 🚀 Quick Start

### 1. Environment Setup

Add these variables to your `.env` file:

```bash
# Required for all environments
FROM_EMAIL=noreply@activpass.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (Resend)
RESEND_API_KEY=re_your_resend_api_key_here

# Development (SMTP - Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Basic Usage

The email service is already integrated into the authentication flow:

```typescript
// Password reset is triggered via the API
await api.auth.forgotPassword.mutate({ email: 'user@example.com' });

// This automatically sends a professional email template
```

### 3. Manual Usage

You can also use the email service directly:

```typescript
import { sendPasswordResetEmail } from '@/server/api/services/email';

const result = await sendPasswordResetEmail({
  username: 'John Doe',
  email: 'john@example.com',
  resetToken: 'secure_token_here',
  expirationHours: 24,
});

if (result.success) {
  console.log('Email sent:', result.messageId);
}
```

## 📧 Email Templates

### Password Reset Email Features

1. **Professional Header**

   - ActivPass branding
   - Gradient background
   - Clean typography

2. **Clear Instructions**

   - Personalized greeting
   - Clear call-to-action button
   - Alternative text link for accessibility

3. **Security Features**

   - Expiration warning (24 hours)
   - "Didn't request this?" section
   - One-time use notice

4. **Mobile Responsive**
   - Adapts to all screen sizes
   - Touch-friendly buttons
   - Readable typography

### Password Reset Success Email Features

1. **Confirmation Message**

   - Success confirmation
   - Timestamp of reset
   - Security notice

2. **Security Tips**

   - Password best practices
   - Account protection advice
   - Support contact information

3. **Quick Access**
   - Direct sign-in link
   - Professional footer

## 🔧 Technical Details

### File Structure

```
src/server/api/
├── services/email/
│   ├── index.ts                   # Export all email functions
│   └── email.service.ts           # High-level email functions
├── lib/
│   ├── email-templates/
│   │   ├── index.ts                    # Export all templates
│   │   ├── base-template.ts           # Shared styling and layout
│   │   ├── password-reset.ts          # Password reset email
│   │   ├── password-reset-success.ts  # Success confirmation email
│   │   └── __tests__/
│   │       └── email-templates.test.ts # Unit tests
│   ├── resend.ts                      # Core email sending logic
│   └── email-example-usage.ts         # Usage examples
```

### Integration Points

1. **Auth Service** (`src/server/api/routers/auth/service/auth.service.ts`)

   - `forgotPassword()` - Sends reset email
   - `resetPassword()` - Sends success confirmation

2. **User Repository** (`src/server/api/routers/user/repository/user.repository.ts`)

   - Token generation and validation
   - User data retrieval

3. **Frontend Forms**
   - Forgot password form updates
   - Success messaging

## 🎨 Email Design Features

### Visual Design

- **Modern gradient header** with ActivPass branding
- **Professional typography** using system fonts
- **Consistent color scheme** (Blue gradient theme)
- **Card-based layout** with subtle shadows
- **Responsive grid system** for mobile compatibility

### User Experience

- **Clear hierarchy** with headings and sections
- **Prominent call-to-action** button
- **Alternative text links** for accessibility
- **Security warnings** in highlighted boxes
- **Footer with contact information**

### Technical Features

- **Inline CSS** for maximum email client compatibility
- **Progressive enhancement** with fallbacks
- **Accessible markup** with proper semantic HTML
- **Cross-client testing** considerations

## 🔒 Security Considerations

### Email Security

1. **No email enumeration** - Always returns success
2. **Time-limited tokens** - 24-hour expiration
3. **One-time use** - Tokens invalidated after use
4. **Secure logging** - No sensitive data in logs

### Token Security

1. **Cryptographically secure** token generation
2. **Database validation** - Server-side verification
3. **Expiration handling** - Automatic cleanup
4. **Rate limiting** - Prevent abuse (recommended)

### User Privacy

1. **Professional messaging** - No technical details exposed
2. **Clear opt-out** - Easy to ignore if not requested
3. **Support contact** - Help available if needed

## 🧪 Testing

### Unit Tests

```bash
# Run email template tests
pnpm test email-templates
```

### Manual Testing

```bash
# Test in development (uses console output)
node -e "require('./src/server/api/lib/email-example-usage.ts').exampleUsage()"
```

### Production Testing

- Use a test email address
- Verify email delivery and formatting
- Check mobile responsiveness
- Test in various email clients

## 🚨 Troubleshooting

### Common Issues

1. **Emails not sending in development**

   - Check SMTP configuration
   - Verify email service is running
   - Check console logs for errors

2. **Gmail SMTP issues**

   - Use App Password, not regular password
   - Enable 2FA first
   - Check "Less secure app access" settings

3. **Resend production issues**

   - Verify API key is correct
   - Check domain configuration
   - Review Resend dashboard logs

4. **Template rendering issues**
   - Check environment variables
   - Verify import paths
   - Review TypeScript types

### Debug Mode

Development mode includes helpful logging:

```
📧 Email service running in development mode
✅ SMTP configured: smtp.gmail.com:587
📤 Sending password reset email to: user@example.com
✅ Email sent successfully: dev-1693958400000
```

## 🛣️ Roadmap

### Planned Enhancements

- [ ] Welcome email template
- [ ] Account verification email template
- [ ] Email preferences management
- [ ] HTML email preview in development
- [ ] Template theming system
- [ ] A/B testing support
- [ ] Email analytics integration

### Performance Optimizations

- [ ] Email queue system for high volume
- [ ] Template caching
- [ ] CDN integration for images
- [ ] Email delivery analytics

---

## 📞 Support

For questions or issues with the email system:

1. Check this documentation first
2. Review the example usage file
3. Check the unit tests for expected behavior
4. Contact the development team

**Happy emailing! 📧**
