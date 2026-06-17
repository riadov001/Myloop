import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adStatusEnum = pgEnum("ad_status", ["pending", "published", "rejected"]);

export const adsTable = pgTable("ads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  product: text("product").notNull(),
  quantity: text("quantity"),
  category: text("category").notNull(),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  status: adStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdSchema = createInsertSchema(adsTable).omit({ id: true, createdAt: true, status: true });
export type InsertAd = z.infer<typeof insertAdSchema>;
export type Ad = typeof adsTable.$inferSelect;
