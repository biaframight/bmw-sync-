import { pgTable, text, serial, boolean, real, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  images: text("images").array().notNull().default([]),
  sellerId: integer("seller_id").notNull(),
  sellerName: text("seller_name").notNull(),
  sellerWhatsapp: text("seller_whatsapp").notNull(),
  sellerAvatar: text("seller_avatar"),
  isSponsored: boolean("is_sponsored").notNull().default(false),
  isPremiumSeller: boolean("is_premium_seller").notNull().default(false),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  stock: integer("stock").notNull().default(1),
  deliveryOptions: text("delivery_options").array().notNull().default([]),
  paymentMethods: text("payment_methods").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, rating: true, reviewCount: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
