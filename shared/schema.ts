import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 10 }).notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerInitials: varchar("customer_initials", { length: 3 }).notNull(),
  avatarColor: varchar("avatar_color", { length: 10 }).notNull(),
  date: text("date").notNull(),
  amount: text("amount").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  revenue: text("revenue").notNull(),
  revenueValue: text("revenue_value").notNull(),
  revenueTrend: text("revenue_trend").notNull(),
  revenueTrendIsPositive: boolean("revenue_trend_is_positive").notNull(),
  
  users: text("users").notNull(),
  usersValue: text("users_value").notNull(),
  usersTrend: text("users_trend").notNull(),
  usersTrendIsPositive: boolean("users_trend_is_positive").notNull(),
  
  conversion: text("conversion").notNull(),
  conversionValue: text("conversion_value").notNull(),
  conversionTrend: text("conversion_trend").notNull(),
  conversionTrendIsPositive: boolean("conversion_trend_is_positive").notNull(),
  
  orderValue: text("order_value").notNull(),
  orderValueValue: text("order_value_value").notNull(),
  orderValueTrend: text("order_value_trend").notNull(),
  orderValueTrendIsPositive: boolean("order_value_trend_is_positive").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
});

// Authentication
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Stats = typeof stats.$inferSelect;
export type Login = z.infer<typeof loginSchema>;
