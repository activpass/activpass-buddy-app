/**
 * Example script showing how to use the ActivPass email system
 * This file demonstrates the password reset email functionality
 */

import { logger } from '@/server/logger';

import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '..';

// Example usage of the password reset email system
export const exampleUsage = async () => {
  logger.log('🔐 ActivPass Email System Example');
  logger.log('=================================\n');

  // Example 1: Send password reset email
  logger.log('1. Sending password reset email...');
  try {
    const resetResult = await sendPasswordResetEmail({
      username: 'John Doe',
      email: 'john.doe@example.com',
      resetToken: 'example_reset_token_123',
      expirationHours: 24,
    });

    if (resetResult.success) {
      logger.log('✅ Password reset email sent successfully!');
      logger.log(`   Message ID: ${resetResult.messageId}`);
    } else {
      logger.log('❌ Failed to send password reset email');
      logger.log(`   Error: ${resetResult.error}`);
    }
  } catch (error) {
    logger.log('❌ Error sending password reset email:', error);
  }

  logger.log('');

  // Example 2: Send password reset success email
  logger.log('2. Sending password reset success email...');
  try {
    const successResult = await sendPasswordResetSuccessEmail({
      username: 'John Doe',
      email: 'john.doe@example.com',
      resetDate: new Date(),
    });

    if (successResult.success) {
      logger.log('✅ Password reset success email sent successfully!');
      logger.log(`   Message ID: ${successResult.messageId}`);
    } else {
      logger.log('❌ Failed to send password reset success email');
      logger.log(`   Error: ${successResult.error}`);
    }
  } catch (error) {
    logger.log('❌ Error sending password reset success email:', error);
  }

  logger.log('\n📧 Email system demonstration complete!');
};

// Run the example if this file is executed directly
if (require.main === module) {
  exampleUsage().catch(logger.error);
}
