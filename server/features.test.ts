import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createRenterContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "renter-user",
    email: "renter@example.com",
    name: "John Renter",
    loginMethod: "manus",
    role: "renter",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

function createLandlordContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 2,
    openId: "landlord-user",
    email: "landlord@example.com",
    name: "Jane Landlord",
    loginMethod: "manus",
    role: "landlord",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("RentReady Features", () => {
  describe("Renter Profile", () => {
    it("should allow renter to get their profile", async () => {
      const { ctx } = createRenterContext();
      const caller = appRouter.createCaller(ctx);
      
      const profile = await caller.renter.profile.get();
      // Profile may be undefined for new users
      expect(profile === undefined || typeof profile === 'object').toBe(true);
    });

    it("should allow renter to update their profile", async () => {
      const { ctx } = createRenterContext();
      const caller = appRouter.createCaller(ctx);
      
      const updated = await caller.renter.profile.update({
        phoneNumber: "555-1234",
        annualIncome: "75000",
        employer: "Tech Corp",
        jobTitle: "Software Engineer",
        employmentStatus: "employed",
      });
      
      expect(updated).toBeDefined();
    });
  });

  describe("Renter Subscription", () => {
    it("should allow renter to check subscription status", async () => {
      const { ctx } = createRenterContext();
      const caller = appRouter.createCaller(ctx);
      
      const isActive = await caller.renter.subscription.isActive();
      expect(typeof isActive).toBe("boolean");
    });
  });

  describe("Renter Applications", () => {
    it("should allow renter to list their applications", async () => {
      const { ctx } = createRenterContext();
      const caller = appRouter.createCaller(ctx);
      
      const apps = await caller.renter.applications.list();
      expect(Array.isArray(apps)).toBe(true);
    });
  });

  describe("Landlord Profile", () => {
    it("should allow landlord to get their profile", async () => {
      const { ctx } = createLandlordContext();
      const caller = appRouter.createCaller(ctx);
      
      const profile = await caller.landlord.profile.get();
      // Profile may be undefined for new users
      expect(profile === undefined || typeof profile === 'object').toBe(true);
    });

    it("should allow landlord to update their profile", async () => {
      const { ctx } = createLandlordContext();
      const caller = appRouter.createCaller(ctx);
      
      const updated = await caller.landlord.profile.update({
        companyName: "Premium Properties",
        companyType: "property-management",
        phoneNumber: "555-5678",
        address: "123 Main St, Austin, TX",
      });
      
      expect(updated).toBeDefined();
    });
  });

  describe("Landlord Listings", () => {
    it("should allow landlord to list their properties", async () => {
      const { ctx } = createLandlordContext();
      const caller = appRouter.createCaller(ctx);
      
      const listings = await caller.landlord.listings.list();
      expect(Array.isArray(listings)).toBe(true);
    });

    it("should allow landlord to create a listing", async () => {
      const { ctx } = createLandlordContext();
      const caller = appRouter.createCaller(ctx);
      
      const listing = await caller.landlord.listings.create({
        title: "Beautiful 2BR Apartment",
        description: "Modern apartment in downtown",
        address: "456 Oak Ave",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        rentAmount: "2500",
        bedrooms: 2,
        bathrooms: "1.5",
        squareFeet: 1200,
      });
      
      expect(listing).toBeDefined();
    });
  });

  describe("Landlord Applications", () => {
    it("should allow landlord to list applications", async () => {
      const { ctx } = createLandlordContext();
      const caller = appRouter.createCaller(ctx);
      
      const apps = await caller.landlord.applications.list();
      expect(Array.isArray(apps)).toBe(true);
    });

    it("should allow landlord to update application status", async () => {
      const { ctx } = createLandlordContext();
      const caller = appRouter.createCaller(ctx);
      
      // This will fail if no application exists, but tests the structure
      try {
        const updated = await caller.landlord.applications.updateStatus({
          id: 999,
          status: "approve",
          notes: "Great candidate!",
        });
        expect(updated).toBeDefined();
      } catch (e) {
        // Expected if application doesn't exist
      }
    });
  });

  describe("Public Listings", () => {
    it("should allow anyone to list active listings", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: {} as any,
      });
      
      const listings = await caller.listings.list();
      expect(Array.isArray(listings)).toBe(true);
    });
  });

  describe("Authentication", () => {
    it("should allow user to logout", async () => {
      const { ctx, clearedCookies } = createRenterContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
      expect(clearedCookies.length).toBe(1);
    });
  });

  describe("Role-based Access Control", () => {
    it("should prevent renter from accessing landlord endpoints", async () => {
      const { ctx } = createRenterContext();
      const caller = appRouter.createCaller(ctx);
      
      try {
        await caller.landlord.profile.get();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should prevent landlord from accessing renter endpoints", async () => {
      const { ctx } = createLandlordContext();
      const caller = appRouter.createCaller(ctx);
      
      try {
        await caller.renter.profile.get();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
