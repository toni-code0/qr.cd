
import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User table compatible with Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: text("username"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Matches users.id type
  title: text("title").notNull(),
  destinationUrl: text("destination_url").notNull(),
  slug: text("slug").notNull().unique(),
  scansCount: integer("scans_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").references(() => qrCodes.id).notNull(),
  userAgent: text("user_agent"),
  country: text("country"),
  city: text("city"),
  device: text("device"),
  scannedAt: timestamp("scanned_at").defaultNow(),
});

// === RELATIONS ===
export const usersRelations = relations(users, ({ many }) => ({
  qrCodes: many(qrCodes),
}));

export const qrCodesRelations = relations(qrCodes, ({ one, many }) => ({
  owner: one(users, {
    fields: [qrCodes.userId],
    references: [users.id],
  }),
  scans: many(scans),
}));

export const scansRelations = relations(scans, ({ one }) => ({
  qrCode: one(qrCodes, {
    fields: [scans.qrCodeId],
    references: [qrCodes.id],
  }),
}));

// === SCHEMAS ===
export const insertQrCodeSchema = createInsertSchema(qrCodes).omit({ id: true, userId: true, scansCount: true, createdAt: true, slug: true });
export const updateQrCodeSchema = insertQrCodeSchema.partial();

// === TYPES ===
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type QrCode = typeof qrCodes.$inferSelect;
export type Scan = typeof scans.$inferSelect;
export type CreateQrCodeRequest = z.infer<typeof insertQrCodeSchema>;
export type UpdateQrCodeRequest = z.infer<typeof updateQrCodeSchema>;
