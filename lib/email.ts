import { Resend } from 'resend';

let resend: Resend | null = null;

export async function sendUnreadMessageEmail(userEmail: string, dealId: number) {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY missing");
      return { success: false, error: "Missing key" };
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  // Next.js 15 + React 19 + Playwright tests often struggle with importing full React components dynamically.
  // Instead, we render the raw HTML for testing/production to bypass React serialization bugs in tests.
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #f6f9fc; font-family: sans-serif;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 20px 0 48px; margin-bottom: 64px;">
          <h1 style="color: #333; font-size: 24px; font-weight: bold; padding: 0 20px; margin: 0;">New Message Received</h1>
          <p style="color: #333; font-size: 16px; padding: 0 20px; margin: 16px 0;">You have a new message regarding your sponsorship deal.</p>
          <a href="https://yt-matcher.vercel.app/deal/${dealId}" style="background-color: #007ee6; border-radius: 5px; color: #fff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 50px; text-align: center; text-decoration: none; width: 200px; margin-left: 20px;">Click here to reply</a>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: 'YT Matcher <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'New Message on YT Matcher',
      html: htmlContent,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
