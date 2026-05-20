import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    'http://localhost:3000'
  );
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function sendUnreadMessageEmail({
  recipientEmail,
  recipientName,
  senderName,
  dealId,
  messagePreview,
}) {
  const client = getResendClient();
  if (!client || !recipientEmail) {
    return { skipped: true };
  }

  const { data, error } = await client.emails.send({
    from: process.env.RESEND_FROM_EMAIL?.trim() || 'YT Matcher <onboarding@resend.dev>',
    to: [recipientEmail],
    subject: `New message on deal #${dealId}`,
    html: `
      <div style="background:#0d0d12;color:#ffffff;font-family:Inter,Arial,sans-serif;padding:32px">
        <div style="max-width:560px;margin:0 auto;border:1px solid #27273f;border-radius:12px;padding:28px;background:#121218">
          <p style="margin:0 0 12px;color:#c7cad1">Hi ${escapeHtml(recipientName || 'there')},</p>
          <h1 style="margin:0 0 12px;font-size:24px;line-height:1.2">You have a new message</h1>
          <p style="margin:0 0 18px;color:#c7cad1;line-height:1.6">A new message from ${escapeHtml(senderName || 'your match')} came in for deal #${dealId}.</p>
          <div style="border-left:3px solid #8b5cf6;padding:12px 16px;margin:0 0 20px;color:#ffffff;background:#161622">${escapeHtml(messagePreview || 'You have a new sponsorship message.')}</div>
          <a href="${getBaseUrl()}/deal/${dealId}" style="display:inline-block;background:#8b5cf6;color:#ffffff;text-decoration:none;border-radius:8px;padding:12px 18px;font-weight:700">Open deal</a>
        </div>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return { success: true, id: data?.id || null };
}
