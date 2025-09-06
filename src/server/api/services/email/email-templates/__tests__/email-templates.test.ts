import { generatePasswordResetEmail, generatePasswordResetSuccessEmail } from '../index';

// Mock environment variables
jest.mock('../../../../env', () => ({
  env: {
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  },
}));

describe('Email Templates', () => {
  describe('Password Reset Email', () => {
    it('should generate a password reset email with all required content', () => {
      const props = {
        username: 'John Doe',
        email: 'john@example.com',
        resetToken: 'abc123token',
        expirationHours: 24,
      };

      const { html, text } = generatePasswordResetEmail(props);

      // Check HTML content
      expect(html).toContain('Hello John Doe');
      expect(html).toContain('john@example.com');
      expect(html).toContain('Reset Password');
      expect(html).toContain('24 hours');
      expect(html).toContain('abc123token');

      // Check text content
      expect(text).toContain('Hello John Doe');
      expect(text).toContain('john@example.com');
      expect(text).toContain('24 hours');
      expect(text).toContain('abc123token');
    });

    it('should generate a custom reset URL when provided', () => {
      const props = {
        username: 'Jane Doe',
        email: 'jane@example.com',
        resetToken: 'xyz789token',
        resetUrl: 'https://myapp.com/reset?token=xyz789token',
      };

      const { html, text } = generatePasswordResetEmail(props);

      expect(html).toContain('https://myapp.com/reset?token=xyz789token');
      expect(text).toContain('https://myapp.com/reset?token=xyz789token');
    });
  });

  describe('Password Reset Success Email', () => {
    it('should generate a password reset success email', () => {
      const props = {
        username: 'John Doe',
        email: 'john@example.com',
        resetDate: new Date('2025-09-06T12:00:00Z'),
      };

      const { html, text } = generatePasswordResetSuccessEmail(props);

      // Check HTML content
      expect(html).toContain('Hello John Doe');
      expect(html).toContain('john@example.com');
      expect(html).toContain('successfully reset');
      expect(html).toContain('Sign In to Your Account');

      // Check text content
      expect(text).toContain('Hello John Doe');
      expect(text).toContain('john@example.com');
      expect(text).toContain('successfully reset');
    });
  });
});
