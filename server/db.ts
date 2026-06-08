import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  renterProfiles,
  landlordProfiles,
  renterSubscriptions,
  rentalListings,
  applications,
  paymentTransactions,
  documents,
  InsertRenterProfile,
  InsertLandlordProfile,
  InsertRentalListing,
  InsertApplication,
  InsertPaymentTransaction,
  InsertDocument,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    } else {
      values.role = 'renter';
      updateSet.role = 'renter';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Renter Profile Queries
export async function getRenterProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(renterProfiles).where(eq(renterProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateRenterProfile(userId: number, data: Partial<InsertRenterProfile>) {
  const db = await getDb();
  if (!db) return undefined;
  
  const existing = await getRenterProfile(userId);
  if (existing) {
    await db.update(renterProfiles).set(data).where(eq(renterProfiles.userId, userId));
    return getRenterProfile(userId);
  } else {
    await db.insert(renterProfiles).values({ userId, ...data } as InsertRenterProfile);
    return getRenterProfile(userId);
  }
}

// Landlord Profile Queries
export async function getLandlordProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(landlordProfiles).where(eq(landlordProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateLandlordProfile(userId: number, data: Partial<InsertLandlordProfile>) {
  const db = await getDb();
  if (!db) return undefined;
  
  const existing = await getLandlordProfile(userId);
  if (existing) {
    await db.update(landlordProfiles).set(data).where(eq(landlordProfiles.userId, userId));
    return getLandlordProfile(userId);
  } else {
    await db.insert(landlordProfiles).values({ userId, ...data } as InsertLandlordProfile);
    return getLandlordProfile(userId);
  }
}

// Subscription Queries
export async function getRenterSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(renterSubscriptions).where(eq(renterSubscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateSubscription(userId: number, data: Partial<InsertRenterProfile>) {
  const db = await getDb();
  if (!db) return undefined;
  
  const existing = await getRenterSubscription(userId);
  if (existing) {
    await db.update(renterSubscriptions).set(data).where(eq(renterSubscriptions.userId, userId));
    return getRenterSubscription(userId);
  } else {
    await db.insert(renterSubscriptions).values({ userId, ...data } as any);
    return getRenterSubscription(userId);
  }
}

// Listing Queries
export async function getListingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rentalListings).where(eq(rentalListings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveListings() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rentalListings).where(eq(rentalListings.status, 'active'));
}

export async function getLandlordListings(landlordId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rentalListings).where(eq(rentalListings.landlordId, landlordId));
}

export async function createListing(data: InsertRentalListing) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(rentalListings).values(data);
  const result = await db.select().from(rentalListings).orderBy(rentalListings.id).limit(1);
  return result.length > 0 ? result[result.length - 1] : undefined;
}

// Application Queries
export async function getApplicationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRenterApplications(renterId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(applications).where(eq(applications.renterId, renterId));
}

export async function getLandlordApplications(landlordId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(applications).where(eq(applications.landlordId, landlordId));
}

export async function createApplication(data: InsertApplication) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(applications).values(data);
  const result = await db.select().from(applications).orderBy(applications.id).limit(1);
  return result.length > 0 ? result[result.length - 1] : undefined;
}

export async function updateApplicationStatus(id: number, status: 'pending' | 'approve' | 'reject', notes?: string) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(applications).set({ 
    status, 
    notes: notes || null,
    respondedAt: new Date(),
    viewedAt: new Date()
  }).where(eq(applications.id, id));
  return getApplicationById(id);
}

// Payment Queries
export async function createPaymentTransaction(data: InsertPaymentTransaction) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(paymentTransactions).values(data);
  const result = await db.select().from(paymentTransactions).orderBy(paymentTransactions.id).limit(1);
  return result.length > 0 ? result[result.length - 1] : undefined;
}

export async function getUserPaymentTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(paymentTransactions).where(eq(paymentTransactions.userId, userId));
}

// Document Queries
export async function createDocument(data: InsertDocument) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(documents).values(data);
  const result = await db.select().from(documents).orderBy(documents.id).limit(1);
  return result.length > 0 ? result[result.length - 1] : undefined;
}

export async function getUserDocuments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documents).where(eq(documents.userId, userId));
}
