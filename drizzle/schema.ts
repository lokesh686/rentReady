import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["renter", "landlord", "admin"]).default("renter").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Renter Profile
export const renterProfiles = mysqlTable("renterProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }),
  ssn: varchar("ssn", { length: 11 }),
  annualIncome: decimal("annualIncome", { precision: 12, scale: 2 }),
  incomeSource: varchar("incomeSource", { length: 255 }),
  employer: varchar("employer", { length: 255 }),
  jobTitle: varchar("jobTitle", { length: 255 }),
  employmentStatus: mysqlEnum("employmentStatus", ["employed", "self-employed", "unemployed", "student", "retired"]),
  references: json("references"),
  idDocumentKey: varchar("idDocumentKey", { length: 255 }),
  incomeDocumentKey: varchar("incomeDocumentKey", { length: 255 }),
  simulatedCreditScore: int("simulatedCreditScore").default(750),
  idVerified: boolean("idVerified").default(false),
  incomeVerified: boolean("incomeVerified").default(false),
  employmentVerified: boolean("employmentVerified").default(false),
  profileComplete: boolean("profileComplete").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RenterProfile = typeof renterProfiles.$inferSelect;
export type InsertRenterProfile = typeof renterProfiles.$inferInsert;

// Landlord Profile
export const landlordProfiles = mysqlTable("landlordProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  companyName: varchar("companyName", { length: 255 }),
  companyType: mysqlEnum("companyType", ["individual", "property-management", "corporation"]),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  address: text("address"),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  profileComplete: boolean("profileComplete").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LandlordProfile = typeof landlordProfiles.$inferSelect;
export type InsertLandlordProfile = typeof landlordProfiles.$inferInsert;

// Renter Subscriptions
export const renterSubscriptions = mysqlTable("renterSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  status: mysqlEnum("status", ["active", "expired", "cancelled", "pending"]).default("pending"),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RenterSubscription = typeof renterSubscriptions.$inferSelect;
export type InsertRenterSubscription = typeof renterSubscriptions.$inferInsert;

// Rental Listings
export const rentalListings = mysqlTable("rentalListings", {
  id: int("id").autoincrement().primaryKey(),
  landlordId: int("landlordId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zipCode", { length: 10 }),
  rentAmount: decimal("rentAmount", { precision: 10, scale: 2 }).notNull(),
  bedrooms: int("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  squareFeet: int("squareFeet"),
  amenities: json("amenities"),
  status: mysqlEnum("status", ["active", "inactive", "filled"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RentalListing = typeof rentalListings.$inferSelect;
export type InsertRentalListing = typeof rentalListings.$inferInsert;

// Applications
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  renterId: int("renterId").notNull(),
  landlordId: int("landlordId").notNull(),
  listingId: int("listingId").notNull(),
  status: mysqlEnum("status", ["pending", "approve", "reject"]).default("pending"),
  notes: text("notes"),
  viewedAt: timestamp("viewedAt"),
  respondedAt: timestamp("respondedAt"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed"]).default("pending"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

// Payment Transactions
export const paymentTransactions = mysqlTable("paymentTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["subscription", "packet-fee"]),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  stripeTransactionId: varchar("stripeTransactionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "succeeded", "failed"]).default("pending"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;

// Documents
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  documentType: mysqlEnum("documentType", ["id", "income", "employment", "reference"]),
  fileKey: varchar("fileKey", { length: 255 }).notNull(),
  fileName: varchar("fileName", { length: 255 }),
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
