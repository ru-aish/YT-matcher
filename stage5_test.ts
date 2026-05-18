import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
// MUST load dotenv BEFORE importing anything that relies on process.env
dotenv.config({ path: '.env.local' });
import { sendUnreadMessageEmail } from './lib/email';

test('Stage 5 Verification: Resend Email Integration', async () => {
  console.log("Testing Resend API directly...");
  const result = await sendUnreadMessageEmail('test_recipient@example.com', 999);

  if (result.success) {
    console.log("Stage 5 Passed: Received success from Resend API");
    if (result.data) {
        console.log("Resend ID:", result.data.data?.id);
    }
  } else {
    console.error("Stage 5 Failed: Resend API returned error");
    console.error(result.error);
    throw new Error("Resend failed");
  }
});
