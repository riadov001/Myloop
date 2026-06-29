import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { adsTable } from "./ads";

export const adViewsTable = pgTable("ad_views", {
  id: serial("id").primaryKey(),
  adId: integer("ad_id").notNull().references(() => adsTable.id, { onDelete: "cascade" }),
  visitorIp: text("visitor_ip"),
  userAgent: text("user_agent"),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export type AdView = typeof adViewsTable.$inferSelect;
