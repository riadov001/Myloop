import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const donationStatusEnum = pgEnum("donation_status", ["pending", "completed", "failed", "refunded"]);

export const donationsTable = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "set null" }),
  amount: integer("amount").notNull(), // en centimes
  currency: text("currency").notNull().default("eur"),
  donorName: text("donor_name"),
  donorEmail: text("donor_email"),
  stripeSessionId: text("stripe_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  status: donationStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Donation = typeof donationsTable.$inferSelect;
