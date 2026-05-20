'use server';

import { db, users, deals, messages } from '../lib/db';
import { eq, and } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getDevAuthBypassEmail, getDevAuthBypassRole, isDevAuthBypassEnabled } from '../lib/dev-auth';
import { sendUnreadMessageEmail } from '../lib/email';
import { getPusherServer } from '../lib/pusher';

// Get current database user synced with Clerk, or bypassed for local development/testing
export async function getDbUserAction() {
  try {
    let userId = null;

    if (isDevAuthBypassEnabled()) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      userId = cookieStore.get('dev_user_id')?.value || getDevAuthBypassEmail();
    }

    if (!userId) {
      const authObj = await auth();
      userId = authObj.userId;
    }
    
    if (!userId) return null;

    // Check by googleId (which holds Clerk's userId)
    let result = await db.select().from(users).where(eq(users.googleId, userId)).limit(1);
    
    if (result.length > 0) {
      return result[0];
    }

    return null;
  } catch (error) {
    console.error("Error getting database user:", error);
    return null;
  }
}

// Create database user linked with Clerk, or bypassed for local development/testing
export async function createDbUserAction(role) {
  try {
    let userId = null;
    let email = '';
    let name = '';
    let avatarUrl = null;

    if (isDevAuthBypassEnabled()) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      userId = cookieStore.get('dev_user_id')?.value || getDevAuthBypassEmail();
      email = cookieStore.get('dev_user_email')?.value || getDevAuthBypassEmail();
      name = email.split('@')[0];
      role = role || getDevAuthBypassRole() || 'creator';
    }
    
    if (!userId) {
      const authObj = await auth();
      userId = authObj.userId;
      if (userId) {
        const clerkUser = await currentUser();
        if (clerkUser) {
          email = clerkUser.emailAddresses[0]?.emailAddress || '';
          name = clerkUser.fullName || email.split('@')[0];
          avatarUrl = clerkUser.imageUrl || null;
        }
      }
    }

    if (!userId) return { error: "Not authenticated" };

    // Check if user already exists
    let result = await db.select().from(users).where(eq(users.googleId, userId)).limit(1);
    if (result.length > 0) {
      return { success: true, user: result[0] };
    }

    const newDbUser = await db.insert(users).values({
      email,
      name,
      role: role || 'creator',
      avatarUrl,
      profileCompleted: false,
      googleId: userId,
    }).returning();

    return { success: true, user: newDbUser[0] };
  } catch (error) {
    console.error("Error creating database user:", error);
    return { error: "Database error during user creation" };
  }
}

// Update profile details
export async function updateProfileAction(profileData) {
  try {
    const user = await getDbUserAction();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const effectiveRole = user.profileCompleted ? user.role : profileData.role;

    if (user.profileCompleted && profileData.role && profileData.role !== user.role) {
      return { error: "Role cannot be changed after profile completion" };
    }

    const result = await db.update(users)
      .set({
        name: profileData.name,
        bio: profileData.bio,
        role: effectiveRole,
        youtubeChannel: effectiveRole === 'creator' ? profileData.youtubeChannel : null,
        companyName: effectiveRole === 'brand' ? profileData.companyName : null,
        avatarUrl: profileData.avatarUrl || user.avatarUrl || null,
        profileCompleted: true
      })
      .where(eq(users.id, user.id))
      .returning();

    return { success: true, user: result[0] };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Database error during profile update" };
  }
}

// Seed mock creators for Brand Discovery
export async function seedMockCreatorsAction() {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return { success: true, message: "Mock creator seeding is disabled outside development" };
    }

    const existingCreators = await db.select().from(users).where(eq(users.role, 'creator')).limit(1);
    
    // Only seed if there are no creators
    if (existingCreators.length === 0) {
      const mocks = [
        {
          email: 'mkbhd@ytmatcher.dev',
          name: 'Marques Brownlee',
          role: 'creator',
          profileCompleted: true,
          bio: 'MKBHD: High-quality tech reviews and analysis. 18M+ subscribers.',
          youtubeChannel: 'Marques Brownlee',
          googleId: 'dev_creator_mkbhd'
        },
        {
          email: 'linus@ytmatcher.dev',
          name: 'Linus Tech Tips',
          role: 'creator',
          profileCompleted: true,
          bio: 'Linus Tech Tips: Entertaining reviews, builds, and technology explanations.',
          youtubeChannel: 'Linus Tech Tips',
          googleId: 'dev_creator_linus'
        },
        {
          email: 'pewds@ytmatcher.dev',
          name: 'PewDiePie',
          role: 'creator',
          profileCompleted: true,
          bio: 'Felix: Memes, gaming, and vlogs. The OG content creator.',
          youtubeChannel: 'PewDiePie',
          googleId: 'dev_creator_pewds'
        }
      ];

      for (const mock of mocks) {
        await db.insert(users).values(mock).onConflictDoNothing();
      }
      return { success: true, message: "Mock creators seeded successfully" };
    }
    return { success: true, message: "Creators already present" };
  } catch (error) {
    console.error("Seeding error:", error);
    return { error: "Failed to seed mock creators" };
  }
}

// Get all creators
export async function getCreatorsAction() {
  try {
    const result = await db.select().from(users).where(eq(users.role, 'creator'));
    return { success: true, creators: result };
  } catch (error) {
    console.error("Error getting creators:", error);
    return { error: "Failed to fetch creators" };
  }
}

// Get all active deals/chats for the current user
export async function getMyDealsAction() {
  try {
    const user = await getDbUserAction();
    if (!user) return { error: "Not authenticated" };

    let myDeals;
    if (user.role === 'brand') {
      myDeals = await db.select().from(deals).where(eq(deals.brandId, user.id));
    } else {
      myDeals = await db.select().from(deals).where(eq(deals.creatorId, user.id));
    }

    const populatedDeals = await Promise.all(myDeals.map(async (deal) => {
      const otherId = user.role === 'brand' ? deal.creatorId : deal.brandId;
      const otherUserResult = await db.select().from(users).where(eq(users.id, otherId)).limit(1);
      return {
        ...deal,
        otherUser: otherUserResult[0] || null
      };
    }));

    return { success: true, deals: populatedDeals };
  } catch (error) {
    console.error("Error getting my deals:", error);
    return { error: "Failed to fetch deals" };
  }
}

// Start a new deal/chat room between Brand and Creator
export async function createDealAction(creatorId, price = 1000) {
  try {
    const brandUser = await getDbUserAction();
    if (!brandUser || brandUser.role !== 'brand') {
      return { error: "Only brands can initiate deals" };
    }

    // Check if deal already exists
    const existing = await db.select()
      .from(deals)
      .where(
        and(
          eq(deals.brandId, brandUser.id),
          eq(deals.creatorId, creatorId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { success: true, dealId: existing[0].id };
    }

    const newDeal = await db.insert(deals).values({
      brandId: brandUser.id,
      creatorId: creatorId,
      status: 'pending',
      price: price
    }).returning();

    return { success: true, dealId: newDeal[0].id };
  } catch (error) {
    console.error("Error creating deal:", error);
    return { error: "Failed to initiate deal" };
  }
}

// Fetch deal details and messages for Chat UI
export async function getDealAction(dealId) {
  try {
    const user = await getDbUserAction();
    if (!user) return { error: "Not authenticated" };

    const dealResult = await db.select().from(deals).where(eq(deals.id, parseInt(dealId))).limit(1);
    if (dealResult.length === 0) return { error: "Deal not found" };
    const deal = dealResult[0];

    if (deal.brandId !== user.id && deal.creatorId !== user.id) {
      return { error: "Unauthorized access to deal" };
    }

    const otherUserId = deal.brandId === user.id ? deal.creatorId : deal.brandId;
    const otherUserResult = await db.select().from(users).where(eq(users.id, otherUserId)).limit(1);
    const otherUser = otherUserResult[0] || null;

    const messageResult = await db.select().from(messages).where(eq(messages.dealId, parseInt(dealId))).orderBy(messages.createdAt);

    // Format dates to string
    const formattedMessages = messageResult.map(msg => ({
      ...msg,
      createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : null
    }));

    const formattedDeal = {
      ...deal,
      createdAt: deal.createdAt ? new Date(deal.createdAt).toISOString() : null
    };

    return {
      success: true,
      deal: formattedDeal,
      currentUser: user,
      otherUser,
      messages: formattedMessages
    };
  } catch (error) {
    console.error("Error fetching deal:", error);
    return { error: "Failed to fetch deal" };
  }
}

export async function getDealActionForUser(dealId, userIdentifier) {
  try {
    const identifier = typeof userIdentifier === 'string' ? userIdentifier.trim() : '';
    if (!identifier) {
      return { error: 'Not authenticated' };
    }

    const userResult = await db.select().from(users).where(eq(users.googleId, identifier)).limit(1);
    const user = userResult[0] || null;
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const dealResult = await db.select().from(deals).where(eq(deals.id, parseInt(dealId))).limit(1);
    if (dealResult.length === 0) return { error: "Deal not found" };
    const deal = dealResult[0];

    if (deal.brandId !== user.id && deal.creatorId !== user.id) {
      return { error: "Unauthorized access to deal" };
    }

    const otherUserId = deal.brandId === user.id ? deal.creatorId : deal.brandId;
    const otherUserResult = await db.select().from(users).where(eq(users.id, otherUserId)).limit(1);
    const otherUser = otherUserResult[0] || null;

    const messageResult = await db.select().from(messages).where(eq(messages.dealId, parseInt(dealId))).orderBy(messages.createdAt);
    const formattedMessages = messageResult.map(msg => ({
      ...msg,
      createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : null
    }));

    const formattedDeal = {
      ...deal,
      createdAt: deal.createdAt ? new Date(deal.createdAt).toISOString() : null
    };

    return {
      success: true,
      deal: formattedDeal,
      currentUser: user,
      otherUser,
      messages: formattedMessages
    };
  } catch (error) {
    console.error("Error fetching deal for user:", error);
    return { error: "Failed to fetch deal" };
  }
}

// Send a message and push to Pusher WebSocket channel
export async function sendMessageAction(dealId, content, senderIdentifier = null) {
  try {
    const identifier = typeof senderIdentifier === 'string' ? senderIdentifier.trim() : '';
    const user = identifier
      ? (await db.select().from(users).where(eq(users.googleId, identifier)).limit(1))[0] || null
      : await getDbUserAction();

    if (!user) return { error: "Not authenticated" };

    const trimmedContent = typeof content === 'string' ? content.trim() : '';
    if (!trimmedContent) {
      return { error: "Message cannot be empty" };
    }

    const pusher = getPusherServer();
    if (!pusher) {
      return { error: "Realtime messaging is not configured. Message was not sent." };
    }

    const dealResult = await db.select().from(deals).where(eq(deals.id, parseInt(dealId))).limit(1);
    if (dealResult.length === 0) return { error: "Deal not found" };
    const deal = dealResult[0];

    if (deal.brandId !== user.id && deal.creatorId !== user.id) {
      return { error: "Unauthorized" };
    }

    const newMessage = await db.insert(messages).values({
      dealId: parseInt(dealId),
      senderId: user.id,
      content: trimmedContent,
    }).returning();

    await pusher.trigger(`deal-${dealId}`, 'new-message', {
      id: newMessage[0].id,
      dealId: parseInt(dealId),
      senderId: user.id,
      content: trimmedContent,
      createdAt: newMessage[0].createdAt.toISOString()
    });

    const receiverId = deal.brandId === user.id ? deal.creatorId : deal.brandId;
    const receiverResult = await db.select().from(users).where(eq(users.id, receiverId)).limit(1);
    if (receiverResult.length > 0) {
      const receiver = receiverResult[0];
      void sendUnreadMessageEmail({
        recipientEmail: receiver.email,
        recipientName: receiver.name,
        senderName: user.name || user.email,
        dealId: deal.id,
        messagePreview: trimmedContent,
      }).catch((emailErr) => {
        console.error('Resend notification failed:', emailErr);
      });
    }

    return {
      success: true,
      message: {
        ...newMessage[0],
        createdAt: newMessage[0].createdAt ? new Date(newMessage[0].createdAt).toISOString() : null
      }
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}

// Update deal status (e.g. escrow funded)
export async function updateDealStatusAction(dealId, status, senderIdentifier = null) {
  try {
    const identifier = typeof senderIdentifier === 'string' ? senderIdentifier.trim() : '';
    const user = identifier
      ? (await db.select().from(users).where(eq(users.googleId, identifier)).limit(1))[0] || null
      : await getDbUserAction();

    if (!user) return { error: "Not authenticated" };

    const dealResult = await db.select().from(deals).where(eq(deals.id, parseInt(dealId))).limit(1);
    if (dealResult.length === 0) return { error: "Deal not found" };
    const deal = dealResult[0];

    if (deal.brandId !== user.id && deal.creatorId !== user.id) {
      return { error: "Unauthorized" };
    }

    const updated = await db.update(deals)
      .set({ status })
      .where(eq(deals.id, parseInt(dealId)))
      .returning();

    // Trigger Pusher WebSocket status update
    const pusher = getPusherServer();
    if (pusher) {
      try {
        await pusher.trigger(`deal-${dealId}`, 'status-updated', {
          dealId: parseInt(dealId),
          status
        });
      } catch (pusherErr) {
        console.error("Pusher trigger failed for status update:", pusherErr);
      }
    }

    const formattedDeal = {
      ...updated[0],
      createdAt: updated[0].createdAt ? new Date(updated[0].createdAt).toISOString() : null
    };

    return { success: true, deal: formattedDeal };
  } catch (error) {
    console.error("Error updating deal status:", error);
    return { error: "Failed to update deal status" };
  }
}
