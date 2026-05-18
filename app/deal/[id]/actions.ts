'use server'

import { db } from '@/db'
import { messages, deals, users } from '@/db/schema'
import { pusherServer } from '@/lib/pusher'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { sendUnreadMessageEmail } from '@/lib/email'

export async function sendMessage(dealId: number, content: string, senderId: number) {
  // Save to db
  const newMessage = await db.insert(messages).values({
    deal_id: dealId,
    sender_id: senderId,
    content: content,
  }).returning()

  // Trigger pusher
  await pusherServer.trigger(`deal-${dealId}`, 'new-message', newMessage[0])

  // Process email notification
  // Find the deal to determine participants
  const deal = await db.query.deals.findFirst({
    where: (deals, { eq }) => eq(deals.id, dealId)
  });

  if (deal) {
    // If sender is brand, target is creator, else target is brand
    const targetUserId = senderId === deal.brand_id ? deal.creator_id : deal.brand_id;

    if (targetUserId) {
      const targetUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, targetUserId)
      });

      if (targetUser && targetUser.email) {
        // Send email asynchronously without blocking the message response
        sendUnreadMessageEmail(targetUser.email, dealId).catch(console.error);
      }
    }
  }

  revalidatePath(`/deal/${dealId}`)
  return newMessage[0]
}
