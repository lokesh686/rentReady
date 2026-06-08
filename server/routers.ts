import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

const renterProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'renter') throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx });
});

const landlordProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'landlord') throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    setRole: protectedProcedure
      .input(z.object({ role: z.enum(['renter', 'landlord']) }))
      .mutation(async ({ ctx, input }) => {
        return { success: true };
      }),
  }),

  // Renter Profile
  renter: router({
    profile: router({
      get: renterProcedure.query(async ({ ctx }) => {
        return await db.getRenterProfile(ctx.user.id);
      }),
      update: renterProcedure
        .input(z.object({
          phoneNumber: z.string().optional(),
          dateOfBirth: z.string().optional(),
          ssn: z.string().optional(),
          annualIncome: z.string().optional(),
          incomeSource: z.string().optional(),
          employer: z.string().optional(),
          jobTitle: z.string().optional(),
          employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'student', 'retired']).optional(),
          references: z.any().optional(),
          idVerified: z.boolean().optional(),
          incomeVerified: z.boolean().optional(),
          employmentVerified: z.boolean().optional(),
          profileComplete: z.boolean().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          return await db.createOrUpdateRenterProfile(ctx.user.id, input);
        }),
      uploadDocument: renterProcedure
        .input(z.object({
          documentType: z.enum(['id', 'income', 'employment', 'reference']),
          fileKey: z.string(),
          fileName: z.string(),
          fileSize: z.number(),
          mimeType: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
          return await db.createDocument({
            userId: ctx.user.id,
            ...input,
          });
        }),
      getDocuments: renterProcedure.query(async ({ ctx }) => {
        return await db.getUserDocuments(ctx.user.id);
      }),
    }),
    subscription: router({
      get: renterProcedure.query(async ({ ctx }) => {
        return await db.getRenterSubscription(ctx.user.id);
      }),
      isActive: renterProcedure.query(async ({ ctx }) => {
        const sub = await db.getRenterSubscription(ctx.user.id);
        return sub?.status === 'active';
      }),
      createCheckout: renterProcedure.mutation(async ({ ctx }) => {
        // This will be called from frontend to initiate Stripe checkout
        return { clientSecret: 'test-secret' };
      }),
    }),
    applications: router({
      list: renterProcedure.query(async ({ ctx }) => {
        return await db.getRenterApplications(ctx.user.id);
      }),
      create: renterProcedure
        .input(z.object({
          listingId: z.number(),
          landlordId: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
          // Check subscription
          const sub = await db.getRenterSubscription(ctx.user.id);
          if (sub?.status !== 'active') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Active subscription required' });
          }
          return await db.createApplication({
            renterId: ctx.user.id,
            landlordId: input.landlordId,
            listingId: input.listingId,
            status: 'pending',
          });
        }),
    }),
  }),

  // Landlord Portal
  landlord: router({
    profile: router({
      get: landlordProcedure.query(async ({ ctx }) => {
        return await db.getLandlordProfile(ctx.user.id);
      }),
      update: landlordProcedure
        .input(z.object({
          companyName: z.string().optional(),
          companyType: z.enum(['individual', 'property-management', 'corporation']).optional(),
          phoneNumber: z.string().optional(),
          address: z.string().optional(),
          profileComplete: z.boolean().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          return await db.createOrUpdateLandlordProfile(ctx.user.id, input);
        }),
    }),
    listings: router({
      list: landlordProcedure.query(async ({ ctx }) => {
        return await db.getLandlordListings(ctx.user.id);
      }),
      create: landlordProcedure
        .input(z.object({
          title: z.string(),
          description: z.string().optional(),
          address: z.string(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          rentAmount: z.string(),
          bedrooms: z.number().optional(),
          bathrooms: z.string().optional(),
          squareFeet: z.number().optional(),
          amenities: z.any().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          return await db.createListing({
            landlordId: ctx.user.id,
            ...input,
          } as any);
        }),
      get: landlordProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await db.getListingById(input.id);
        }),
    }),
    applications: router({
      list: landlordProcedure.query(async ({ ctx }) => {
        return await db.getLandlordApplications(ctx.user.id);
      }),
      get: landlordProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await db.getApplicationById(input.id);
        }),
      updateStatus: landlordProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(['pending', 'approve', 'reject']),
          notes: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          return await db.updateApplicationStatus(input.id, input.status, input.notes);
        }),
    }),
    billing: router({
      getTransactions: landlordProcedure.query(async ({ ctx }) => {
        return await db.getUserPaymentTransactions(ctx.user.id);
      }),
    }),
  }),

  // Public Listings
  listings: router({
    list: publicProcedure.query(async () => {
      return await db.getActiveListings();
    }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getListingById(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
