import { pgTable, serial, text, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }), // Nullable for Google-only signups
  role: varchar('role', { length: 50 }).notNull(), // 'brand' or 'creator'
  name: varchar('name', { length: 255 }),
  googleId: varchar('google_id', { length: 255 }),
  profileCompleted: boolean('profile_completed').default(false),
  bio: text('bio'),
  youtubeChannel: varchar('youtube_channel', { length: 255 }),
  companyName: varchar('company_name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').references(() => users.id),
  creatorId: integer('creator_id').references(() => users.id),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'matched', 'escrow_funded'
  price: integer('price').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  dealId: integer('deal_id').references(() => deals.id),
  senderId: integer('sender_id').references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

