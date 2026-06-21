import { pgTable, serial, integer, text, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const promotionPricesTable = pgTable("promotion_prices", {
  id: serial("id").primaryKey(),
  duration: integer("duration").notNull(),
  label: text("label").notNull(),
  price: text("price").notNull(),
  active: boolean("active").notNull().default(true),
});

export const insertPromotionPriceSchema = createInsertSchema(promotionPricesTable).omit({ id: true });
export type InsertPromotionPrice = z.infer<typeof insertPromotionPriceSchema>;
export type PromotionPrice = typeof promotionPricesTable.$inferSelect;
