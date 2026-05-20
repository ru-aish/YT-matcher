import { pgTable, serial, text, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }), // Nullable for Google-only signups
  role: varchar('role', { length: 50 }).notNull(), // 'brand' or 'creator'
  name: varchar('name', { length: 255 }),
  googleId: varchar('google_id', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  profileCompleted: boolean('profile_completed').default(false),
  bio: text('bio'),
  youtubeChannel: varchar('youtube_channel', { length: 255 }),
  companyName: varchar('company_name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  requirements: text('requirements'),
  budget: integer('budget').default(0),
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').references(() => users.id),
  creatorId: integer('creator_id').references(() => users.id),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  requirements: text('requirements'),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'matched', 'escrow_funded'
  price: integer('price').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const campaignInterests = pgTable('campaign_interests', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  creatorId: integer('creator_id').references(() => users.id),
  status: varchar('status', { length: 50 }).default('interested'), // 'interested', 'accepted', 'rejected'
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  dealId: integer('deal_id').references(() => deals.id),
  senderId: integer('sender_id').references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
