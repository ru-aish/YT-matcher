'use server';

import { db, users, campaigns, campaignInterests, deals, messages } from '../lib/db';
import { eq, and, desc, ne, sql } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { isDevAuthBypassEnabled } from '../lib/dev-auth';

// ── Helper: Get current user ──────────────────────────────
async function getCurrentUser() {
  // Reuse the same logic from actions.js getDbUserAction
  const { getDbUserAction } = await import('./actions');
  return getDbUserAction();
}

function normalizeCampaign(row) {
  if (!row) return row;

  const budgetMinUsd = row.budgetMinUsd ?? row.budget_min_usd ?? row.budget ?? 0;
  const budgetMaxUsd = row.budgetMaxUsd ?? row.budget_max_usd ?? row.budget ?? budgetMinUsd;
  const brandId = row.brandUserId ?? row.brand_user_id ?? row.brandId ?? null;
  const requiredDeliverable = row.requiredDeliverable ?? row.required_deliverable ?? row.requirements ?? row.description ?? null;
  const targetAudienceCountry = row.targetAudienceCountry ?? row.target_audience_country ?? null;

  return {
    ...formatDates(row),
    brandId,
    brandUserId: brandId,
    targetAudienceCountry,
    budgetMinUsd,
    budgetMaxUsd,
    budget: budgetMaxUsd || budgetMinUsd || 0,
    description: row.description ?? requiredDeliverable,
    requirements: row.requirements ?? requiredDeliverable,
    requiredDeliverable,
  };
}

// ═══════════════════════════════════════════════════════════
// CAMPAIGN ACTIONS
// ═══════════════════════════════════════════════════════════

// Create a new campaign (Brand only)
export async function createCampaignAction({ title, description, requirements, budget }) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };
    if (user.role !== 'brand') return { error: 'Only brands can create campaigns' };
    if (!title?.trim()) return { error: 'Campaign title is required' };

    const parsedBudget = parseInt(budget, 10);
    const normalizedBudget = Number.isFinite(parsedBudget) ? parsedBudget : 0;
    const requiredDeliverable = requirements?.trim() || description?.trim() || null;

    const newCampaign = await db.insert(campaigns).values({
      brandUserId: user.id,
      title: title.trim(),
      targetAudienceCountry: null,
      budgetMinUsd: normalizedBudget,
      budgetMaxUsd: normalizedBudget,
      requiredDeliverable,
      status: 'active',
    }).returning();

    return { success: true, campaign: normalizeCampaign(newCampaign[0]) };
  } catch (error) {
    console.error('Error creating campaign:', error);
    return { error: 'Failed to create campaign' };
  }
}

// Get all campaigns for the current brand
export async function getCampaignsAction() {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };
    if (user.role !== 'brand') return { error: 'Only brands can view their campaigns' };

    const result = await db.select()
      .from(campaigns)
      .where(eq(campaigns.brandUserId, user.id))
      .orderBy(desc(campaigns.createdAt));

    // For each campaign, get counts of interests and deals
    const enriched = await Promise.all(result.map(async (campaign) => {
      const interests = await db.select()
        .from(campaignInterests)
        .where(
          and(
            eq(campaignInterests.campaignId, campaign.id),
            eq(campaignInterests.status, 'interested')
          )
        );

      const campaignDeals = await db.select()
        .from(deals)
        .where(eq(deals.campaignId, campaign.id));

      return {
        ...normalizeCampaign(campaign),
        interestCount: interests.length,
        dealCount: campaignDeals.length,
      };
    }));

    return { success: true, campaigns: enriched };
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return { error: 'Failed to fetch campaigns' };
  }
}

// Update a campaign
export async function updateCampaignAction(campaignId, data) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    const existing = await db.select().from(campaigns)
      .where(and(eq(campaigns.id, parseInt(campaignId)), eq(campaigns.brandUserId, user.id)))
      .limit(1);
    if (existing.length === 0) return { error: 'Campaign not found' };

    const parsedBudget = data.budget !== undefined ? parseInt(data.budget, 10) : undefined;
    const normalizedBudget = Number.isFinite(parsedBudget) ? parsedBudget : existing[0].budgetMaxUsd || existing[0].budgetMinUsd || 0;

    const updated = await db.update(campaigns)
      .set({
        title: data.title?.trim() || existing[0].title,
        targetAudienceCountry: data.targetAudienceCountry?.trim() ?? existing[0].targetAudienceCountry ?? null,
        budgetMinUsd: normalizedBudget,
        budgetMaxUsd: normalizedBudget,
        requiredDeliverable: data.requirements?.trim() ?? data.description?.trim() ?? existing[0].requiredDeliverable,
        status: data.status || existing[0].status,
      })
      .where(eq(campaigns.id, parseInt(campaignId)))
      .returning();

    return { success: true, campaign: normalizeCampaign(updated[0]) };
  } catch (error) {
    console.error('Error updating campaign:', error);
    return { error: 'Failed to update campaign' };
  }
}

// Delete a campaign (only if no active deals)
export async function deleteCampaignAction(campaignId) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    const existing = await db.select().from(campaigns)
      .where(and(eq(campaigns.id, parseInt(campaignId)), eq(campaigns.brandUserId, user.id)))
      .limit(1);
    if (existing.length === 0) return { error: 'Campaign not found' };

    // Check for active deals
    const activeDeals = await db.select().from(deals)
      .where(and(
        eq(deals.campaignId, parseInt(campaignId)),
        ne(deals.status, 'completed')
      ));

    if (activeDeals.length > 0) {
      return { error: 'Cannot delete campaign with active deals' };
    }

    // Delete related interests first
    await db.delete(campaignInterests)
      .where(eq(campaignInterests.campaignId, parseInt(campaignId)));

    await db.delete(campaigns)
      .where(eq(campaigns.id, parseInt(campaignId)));

    return { success: true };
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return { error: 'Failed to delete campaign' };
  }
}

// Get single campaign with details (interested creators + deals)
export async function getCampaignDetailAction(campaignId) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    const result = await db.select().from(campaigns)
      .where(eq(campaigns.id, parseInt(campaignId)))
      .limit(1);
    if (result.length === 0) return { error: 'Campaign not found' };

    const campaign = result[0];

    // Check access: brand owner or creator with interest/deal
    if (user.role === 'brand' && campaign.brandUserId !== user.id) {
      return { error: 'Unauthorized' };
    }

    // Get interested creators with user info
    const interests = await db.select()
      .from(campaignInterests)
      .where(eq(campaignInterests.campaignId, campaign.id))
      .orderBy(desc(campaignInterests.createdAt));

    const enrichedInterests = await Promise.all(interests.map(async (interest) => {
      const creatorResult = await db.select().from(users)
        .where(eq(users.id, interest.creatorId))
        .limit(1);
      return {
        ...formatDates(interest),
        creator: creatorResult[0] ? formatDates(creatorResult[0]) : null,
      };
    }));

    // Get deals for this campaign
    const campaignDeals = await db.select().from(deals)
      .where(eq(deals.campaignId, campaign.id))
      .orderBy(desc(deals.createdAt));

    const enrichedDeals = await Promise.all(campaignDeals.map(async (deal) => {
      const creatorResult = await db.select().from(users)
        .where(eq(users.id, deal.creatorId))
        .limit(1);
      return {
        ...formatDates(deal),
        creator: creatorResult[0] ? formatDates(creatorResult[0]) : null,
      };
    }));

    // Get brand info
    const brandResult = await db.select().from(users)
      .where(eq(users.id, campaign.brandUserId))
      .limit(1);

    return {
      success: true,
      campaign: normalizeCampaign(campaign),
      brand: brandResult[0] ? formatDates(brandResult[0]) : null,
      interests: enrichedInterests,
      deals: enrichedDeals,
      currentUser: user,
    };
  } catch (error) {
    console.error('Error fetching campaign detail:', error);
    return { error: 'Failed to fetch campaign details' };
  }
}

// ═══════════════════════════════════════════════════════════
// CREATOR INTEREST ACTIONS
// ═══════════════════════════════════════════════════════════

// Get available campaigns for creators (active campaigns from all brands)
export async function getAvailableCampaignsAction() {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };
    if (user.role !== 'creator') return { error: 'Only creators can browse campaigns' };

    const activeCampaigns = await db.select()
      .from(campaigns)
      .where(eq(campaigns.status, 'active'))
      .orderBy(desc(campaigns.createdAt));

    // Enrich with brand info and whether this creator has already expressed interest
    const enriched = await Promise.all(activeCampaigns.map(async (campaign) => {
      const brandResult = await db.select().from(users)
        .where(eq(users.id, campaign.brandUserId))
        .limit(1);

      const existingInterest = await db.select().from(campaignInterests)
        .where(and(
          eq(campaignInterests.campaignId, campaign.id),
          eq(campaignInterests.creatorId, user.id)
        ))
        .limit(1);

      return {
        ...normalizeCampaign(campaign),
        brand: brandResult[0] ? { name: brandResult[0].name, companyName: brandResult[0].companyName, avatarUrl: brandResult[0].avatarUrl } : null,
        myInterest: existingInterest[0] ? formatDates(existingInterest[0]) : null,
      };
    }));

    return { success: true, campaigns: enriched };
  } catch (error) {
    console.error('Error fetching available campaigns:', error);
    return { error: 'Failed to fetch campaigns' };
  }
}

// Creator expresses interest in a campaign
export async function expressInterestAction(campaignId) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };
    if (user.role !== 'creator') return { error: 'Only creators can express interest' };

    // Check campaign exists and is active
    const campaign = await db.select().from(campaigns)
      .where(and(eq(campaigns.id, parseInt(campaignId)), eq(campaigns.status, 'active')))
      .limit(1);
    if (campaign.length === 0) return { error: 'Campaign not found or inactive' };

    // Check if already interested
    const existing = await db.select().from(campaignInterests)
      .where(and(
        eq(campaignInterests.campaignId, parseInt(campaignId)),
        eq(campaignInterests.creatorId, user.id)
      ))
      .limit(1);

    if (existing.length > 0) {
      return { success: true, interest: formatDates(existing[0]), message: 'Already expressed interest' };
    }

    const newInterest = await db.insert(campaignInterests).values({
      campaignId: parseInt(campaignId),
      creatorId: user.id,
      status: 'interested',
    }).returning();

    return { success: true, interest: formatDates(newInterest[0]) };
  } catch (error) {
    console.error('Error expressing interest:', error);
    return { error: 'Failed to express interest' };
  }
}

// Brand accepts a creator's interest → creates a deal
export async function acceptCreatorAction(campaignId, creatorId) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };
    if (user.role !== 'brand') return { error: 'Only brands can accept creators' };

    // Verify campaign ownership
    const campaign = await db.select().from(campaigns)
      .where(and(eq(campaigns.id, parseInt(campaignId)), eq(campaigns.brandUserId, user.id)))
      .limit(1);
    if (campaign.length === 0) return { error: 'Campaign not found' };

    // Update interest status
    await db.update(campaignInterests)
      .set({ status: 'accepted' })
      .where(and(
        eq(campaignInterests.campaignId, parseInt(campaignId)),
        eq(campaignInterests.creatorId, parseInt(creatorId))
      ));

    // Check if deal already exists for this campaign+creator
    const existingDeal = await db.select().from(deals)
      .where(and(
        eq(deals.campaignId, parseInt(campaignId)),
        eq(deals.creatorId, parseInt(creatorId)),
        eq(deals.brandId, user.id)
      ))
      .limit(1);

    if (existingDeal.length > 0) {
      return { success: true, dealId: existingDeal[0].id };
    }

    // Create deal linked to campaign
    const newDeal = await db.insert(deals).values({
      brandId: user.id,
      creatorId: parseInt(creatorId),
      campaignId: parseInt(campaignId),
      title: campaign[0].title,
      description: campaign[0].requiredDeliverable,
      requirements: campaign[0].requiredDeliverable,
      status: 'pending',
      price: campaign[0].budgetMaxUsd || campaign[0].budgetMinUsd || 0,
    }).returning();

    return { success: true, dealId: newDeal[0].id };
  } catch (error) {
    console.error('Error accepting creator:', error);
    return { error: 'Failed to accept creator' };
  }
}

// Brand rejects a creator's interest
export async function rejectInterestAction(interestId) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    const interest = await db.select().from(campaignInterests)
      .where(eq(campaignInterests.id, parseInt(interestId)))
      .limit(1);
    if (interest.length === 0) return { error: 'Interest not found' };

    // Verify the campaign belongs to this brand
    const campaign = await db.select().from(campaigns)
      .where(and(eq(campaigns.id, interest[0].campaignId), eq(campaigns.brandUserId, user.id)))
      .limit(1);
    if (campaign.length === 0) return { error: 'Unauthorized' };

    await db.update(campaignInterests)
      .set({ status: 'rejected' })
      .where(eq(campaignInterests.id, parseInt(interestId)));

    return { success: true };
  } catch (error) {
    console.error('Error rejecting interest:', error);
    return { error: 'Failed to reject interest' };
  }
}

// ═══════════════════════════════════════════════════════════
// CHAT THREAD ACTIONS
// ═══════════════════════════════════════════════════════════

// Get all chat threads for sidebar (deals with last message preview)
export async function getChatThreadsAction() {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    let myDeals;
    if (user.role === 'brand') {
      myDeals = await db.select().from(deals)
        .where(eq(deals.brandId, user.id))
        .orderBy(desc(deals.createdAt));
    } else {
      myDeals = await db.select().from(deals)
        .where(eq(deals.creatorId, user.id))
        .orderBy(desc(deals.createdAt));
    }

    const threads = await Promise.all(myDeals.map(async (deal) => {
      const otherId = user.role === 'brand' ? deal.creatorId : deal.brandId;
      const otherUserResult = await db.select().from(users)
        .where(eq(users.id, otherId))
        .limit(1);

      // Get last message
      const lastMsgResult = await db.select().from(messages)
        .where(eq(messages.dealId, deal.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const lastMsg = lastMsgResult[0];

      return {
        dealId: deal.id,
        dealStatus: deal.status,
        dealPrice: deal.price,
        dealTitle: deal.title,
        otherUser: otherUserResult[0] ? {
          name: otherUserResult[0].name,
          avatarUrl: otherUserResult[0].avatarUrl,
          role: otherUserResult[0].role,
          companyName: otherUserResult[0].companyName,
          youtubeChannel: otherUserResult[0].youtubeChannel,
        } : null,
        lastMessage: lastMsg ? lastMsg.content.slice(0, 50) : null,
        lastMessageAt: lastMsg?.createdAt ? new Date(lastMsg.createdAt).toISOString() : null,
        hasUnread: false, // TODO: implement unread tracking
      };
    }));

    return { success: true, threads };
  } catch (error) {
    console.error('Error fetching chat threads:', error);
    return { error: 'Failed to fetch chat threads' };
  }
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function formatDates(obj) {
  if (!obj) return obj;
  const result = { ...obj };
  if (result.createdAt instanceof Date) {
    result.createdAt = result.createdAt.toISOString();
  }
  return result;
}
