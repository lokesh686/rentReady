# RentReady - Project TODO

## Database & Schema
- [x] Define renter profile schema (personal info, credit score, income, employment, references)
- [x] Define landlord profile schema (company info, payment method, billing preferences)
- [x] Define rental listing schema (property details, location, rent amount, requirements)
- [x] Define application schema (renter, landlord, listing, status, timestamps)
- [x] Define subscription schema (renter subscriptions, billing cycles, stripe customer IDs)
- [x] Define payment schema (transactions, invoices, stripe payment intents)
- [x] Define document schema (file uploads, storage keys, document types)
- [x] Create database migrations and apply to database

## Authentication & Authorization
- [x] Implement role-based access control (renter vs landlord)
- [x] Add role field to user table and extend schema
- [x] Create role-based procedures (protectedProcedure for both, adminProcedure pattern)
- [x] Implement role detection and routing in frontend

## Renter Onboarding Flow
- [ ] Create multi-step form component with progress indicator
- [ ] Step 1: Personal information (name, email, phone, date of birth, SSN)
- [ ] Step 2: ID upload (driver's license or passport)
- [ ] Step 3: Income details (annual income, income source)
- [ ] Step 4: Employment information (employer, job title, employment status)
- [ ] Step 5: References (personal references with contact info)
- [ ] Implement form validation and error handling
- [ ] Create onboarding completion status tracking
- [ ] Add document upload with file storage integration

## Renter Profile Card
- [ ] Create verified profile card component (shareable summary)
- [ ] Display simulated credit score (labeled as simulated)
- [ ] Display income verification badge
- [ ] Display ID verification status
- [ ] Display employment verification badge
- [ ] Add reference count display
- [ ] Generate shareable profile PDF
- [ ] Create profile card sharing mechanism (URL-based)

## Renter Subscription Billing
- [ ] Integrate Stripe for renter subscriptions
- [ ] Create subscription plan ($49/year)
- [ ] Build subscription checkout flow
- [ ] Implement subscription status tracking (active, expired, cancelled)
- [ ] Create subscription management page (view plan, cancel, renew)
- [ ] Add subscription validation before allowing apply feature
- [ ] Create billing history view

## Landlord Portal
- [ ] Create landlord dashboard layout
- [ ] Build applicant packet inbox/list view
- [ ] Create applicant detail view (full profile, documents, verification status)
- [ ] Implement application status management (approve, reject, pending)
- [ ] Add application notes/comments feature
- [ ] Create landlord profile/company setup page
- [ ] Build payment method management page
- [ ] Create billing history and invoice view

## Landlord Pay-Per-Packet Billing
- [ ] Integrate Stripe for landlord pay-per-packet model
- [ ] Create payment intent on application view
- [ ] Implement $10 charge per packet viewed
- [ ] Track payment status and reconciliation
- [ ] Create invoice generation for landlord
- [ ] Add payment history and billing dashboard

## One-Tap Apply Flow
- [ ] Create rental listings browse/search page
- [ ] Build listing detail view
- [ ] Implement one-tap apply button (requires active subscription)
- [ ] Create application submission flow
- [ ] Add confirmation dialog before sending packet
- [ ] Implement application sent confirmation

## Rental Listings Management
- [ ] Create landlord listing creation form
- [ ] Build listing edit/update functionality
- [ ] Implement listing status management (active, inactive, filled)
- [ ] Create listings management dashboard for landlords
- [ ] Add listing search and filtering for renters

## Application Status Tracking
- [ ] Create renter applications view (my applications)
- [ ] Display application status for each submission (pending, approved, rejected)
- [ ] Show landlord response/notes on applications
- [ ] Add application timeline/history
- [ ] Implement status update notifications

## Document & File Management
- [ ] Implement secure file upload for ID documents
- [ ] Implement secure file upload for income documents
- [ ] Create document storage integration (S3)
- [ ] Add file type validation
- [ ] Implement file size limits
- [ ] Create document download functionality for landlords

## Landing Page
- [x] Design and build landing page layout
- [x] Create hero section with compelling copy
- [x] Build feature highlights section (for renters and landlords)
- [x] Create pricing section ($49/year renters, $10/packet landlords)
- [x] Add CTAs for renter and landlord signup
- [ ] Build FAQ section
- [ ] Add trust indicators and testimonial section
- [x] Optimize for mobile responsiveness

## Navigation & Routing
- [x] Create main navigation component
- [x] Implement role-based navigation (different for renters vs landlords)
- [x] Build renter dashboard layout
- [x] Build landlord dashboard layout
- [x] Create route guards for authenticated pages
- [x] Implement logout functionality

## Stripe Integration
- [ ] Set up Stripe API keys and environment variables
- [ ] Implement Stripe checkout for renter subscriptions
- [ ] Implement Stripe checkout for landlord pay-per-packet
- [ ] Create webhook handlers for payment events
- [ ] Implement payment success/failure handling
- [ ] Add payment confirmation emails

## UI/UX Polish
- [ ] Implement elegant, premium design system
- [ ] Create consistent spacing and typography
- [ ] Add smooth animations and transitions
- [ ] Implement loading states and skeletons
- [ ] Add error handling and user feedback
- [ ] Create empty states for various views
- [ ] Implement responsive design for all pages
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

## Testing
- [x] Write unit tests for database queries
- [x] Write tests for authentication procedures
- [ ] Write tests for billing calculations
- [ ] Write tests for application status workflows
- [ ] Test renter onboarding flow end-to-end
- [ ] Test landlord application review flow
- [ ] Test payment processing flows

## Deployment & Final Steps
- [ ] Configure production environment variables
- [ ] Set up Stripe production keys
- [ ] Create database backups
- [ ] Perform security audit
- [ ] Test all payment flows in production mode
- [ ] Create user documentation
- [ ] Package project as zip file
