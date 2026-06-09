# RentReady - Rental Application Autopilot

Streamlined rental application platform connecting renters and landlords through verified profiles and instant applications.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React 19 + Vite)                  │
├─────────────────────────────────────────────────────────────────┤
│  Landing │ Renter Dashboard │ Landlord Dashboard │ Applications │
│  Onboarding │ Profile Card │ Listings │ Subscription Management │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    tRPC Client (@trpc/react-query)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│              Backend (Express 4 + tRPC 11 + Node.js)            │
├─────────────────────────────────────────────────────────────────┤
│  Authentication (Manus OAuth)                                   │
│  ├─ Renter Router (profiles, subscriptions, applications)       │
│  ├─ Landlord Router (listings, applications, billing)           │
│  └─ Public Router (listings, auth)                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼──────┐  ┌──────────▼────────┐  ┌──────▼──────────┐
│  MySQL/TiDB  │  │  Stripe Payment   │  │  S3 File Storage│
│  Database    │  │  Processing       │  │  (Documents)    │
│  (8 Tables)  │  │  ($49/yr, $10/pkt)│  │                 │
└──────────────┘  └───────────────────┘  └─────────────────┘
```

## 🗄️ Core Database Schema

| Table | Purpose |
|-------|---------|
| **users** | Authentication & roles (renter, landlord, admin) |
| **renterProfiles** | Income, employment, references, verification status |
| **landlordProfiles** | Company info, billing preferences |
| **listings** | Property details, rent, requirements |
| **applications** | Renter→Landlord applications (status: approve/reject/pending) |
| **subscriptions** | Renter billing ($49/year) |
| **payments** | Transaction history & invoices |
| **documents** | ID, income verification uploads |

## ✨ Core Features

### For Renters
- ✅ 5-step verified onboarding (personal info, income, employment, documents, references)
- ✅ Shareable profile card with simulated credit score
- ✅ Browse listings and apply with one tap
- ✅ $49/year subscription for unlimited applications
- ✅ Track application status (pending, approved, rejected)

### For Landlords
- ✅ Create and manage rental listings
- ✅ Review applicant packets with verification badges
- ✅ Approve/reject/pending application status management
- ✅ Add notes to applications
- ✅ $10 per applicant packet reviewed (Stripe pay-per-use)

### Platform
- ✅ Role-based authentication (Manus OAuth)
- ✅ Secure file storage for documents
- ✅ Stripe payment processing (subscriptions + pay-per-packet)
- ✅ Premium responsive UI (Tailwind CSS 4)
- ✅ 15+ passing unit tests

## 📁 Project Structure

```
rentready/
├── client/                 # React 19 frontend (Vite)
│   ├── src/pages/         # 11 page components
│   ├── src/components/    # Reusable UI components
│   └── src/lib/           # tRPC client, utilities
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   └── _core/             # Auth, OAuth, storage
├── drizzle/               # Database schema & migrations
├── shared/                # Shared types & constants
└── storage/               # S3 file storage helpers
```

## 🔧 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, shadcn/ui
- **Backend:** Express 4, tRPC 11, Node.js
- **Database:** MySQL/TiDB with Drizzle ORM
- **Auth:** Manus OAuth 2.0
- **Payments:** Stripe API
- **Storage:** S3 (file uploads)
- **Testing:** Vitest

## 🚢 Deployment

### Environment Variables Required
```
DATABASE_URL=mysql://user:pass@host/db
JWT_SECRET=your-secret-key
VITE_APP_ID=your-oauth-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Deploy to Render
1. Push to GitHub (already done)
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy (Render auto-detects Node.js + builds)

### Deploy to Vercel
1. Push to GitHub (already done)
2. Import project in Vercel dashboard
3. Set environment variables
4. Deploy (Vercel auto-detects Next.js/Node.js)

**Note:** This is a full-stack Node.js app. Use Render or Railway for full-stack deployment. Vercel requires serverless adaptation.

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

**Test Coverage:** 15 tests covering authentication, profiles, listings, applications, and RBAC.

## 📝 API Routes

All API traffic flows through `/api/trpc` with tRPC procedures:

### Renter Procedures
- `renter.profile.get/update`
- `renter.subscription.get/createCheckout`
- `renter.applications.list/create`
- `renter.listings.browse`

### Landlord Procedures
- `landlord.profile.get/update`
- `landlord.listings.create/list/update/delete`
- `landlord.applications.list/updateStatus`

### Public Procedures
- `public.listings.browse`
- `auth.me/logout`

## 🔐 Security

- OAuth 2.0 authentication via Manus
- Role-based access control (RBAC)
- Protected procedures with `protectedProcedure`
- Secure file storage with S3
- Stripe PCI compliance
- Environment variables for secrets

## 📞 Support

For issues or questions, check the GitHub repository or contact the development team.

---

**Built with ❤️ for renters and landlords**
