import { pgTable, serial, text, varchar, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['brand', 'creator']);
export const dealStatusEnum = pgEnum('deal_status', ['pending', 'matched', 'escrow_funded']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerk_id: varchar("clerk_id", { length: 256 }).unique().notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  role: roleEnum('role').notNull(),
  name: varchar("name", { length: 256 }),
  profile_data: text("profile_data"),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  brand_id: serial("brand_id").references(() => users.id),
  creator_id: serial("creator_id").references(() => users.id),
  status: dealStatusEnum('status').default('pending').notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  deal_id: serial("deal_id").references(() => deals.id),
  sender_id: serial("sender_id").references(() => users.id),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const dealsRelations = relations(deals, ({ one }) => ({
  brand: one(users, {
    fields: [deals.brand_id],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [deals.creator_id],
    references: [users.id],
  }),
}));
