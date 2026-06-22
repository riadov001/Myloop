import { pgTable, serial, text, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const configTypeEnum = pgEnum("config_type", ["string", "boolean", "number", "secret"]);

export const platformConfigTable = pgTable("platform_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  isSecret: boolean("is_secret").notNull().default(false),
  configType: configTypeEnum("config_type").notNull().default("string"),
  label: text("label").notNull(),
  description: text("description"),
  group: text("group").notNull().default("general"),
});

export const insertPlatformConfigSchema = createInsertSchema(platformConfigTable).omit({ id: true });
export type InsertPlatformConfig = z.infer<typeof insertPlatformConfigSchema>;
export type PlatformConfig = typeof platformConfigTable.$inferSelect;
