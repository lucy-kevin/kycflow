# KYC Flow

A self-service customer identity verification platform built with Next.js 14, Prisma, Supabase, and Face++ API.

## Live Demo

🔗 [kycflow.vercel.app](https://kycflow.vercel.app)

**Demo credentials:**
- Email: `demo@kycflow.com`
- Password: `password123`

---

## What It Does

KYC Flow has two completely separate sides:

**Customer Portal** (public, no login required)
- Customer visits the link and fills in their details
- Uploads their ID document (photo)
- Submits and sees a confirmation screen

**Business Dashboard** (protected, login required)
- Business logs in and sees all customer submissions
- Each submission is automatically verified with 5 checks
- Business can search and filter applications
- Business can override any decision and add a reviewer note

---

## The 5 Automated Checks

| Check | Description |
|---|---|
| Name Validation | Full name with at least 2 words, letters only |
| Age Eligibility | Customer must be 18 or older |
| Document Type | Must be National ID, Passport, or Driving Licence |
| Face Detection | A human face must exist in the uploaded document |
| Confidence Score | Face++ returns a score used to decide the outcome |

**Decision logic:**
- Score 85 and above → ✅ Approved
- Score 60 to 84 → 🟡 Manual Review
- Score below 60 → ❌ Rejected

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Full-stack React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Prisma ORM | Database queries |
| Supabase | PostgreSQL database + file storage |
| NextAuth v5 | Business authentication |
| React Hook Form | Customer form management |
| Zod | Form validation |
| Face++ API | Face detection on ID documents |
| Faker.js | Mock data seeding |
| Vercel | Deployment |

---

## Project Structure
```
kycflow/
├── app/
│   ├── page.tsx                    ← Customer portal (submit form)
│   ├── success/page.tsx            ← Confirmation screen
│   ├── dashboard/
│   │   ├── page.tsx                ← Business dashboard table
│   │   ├── [id]/page.tsx           ← Single application detail
│   │   └── layout.tsx              ← Protected layout
│   ├── auth/login/page.tsx         ← Business login
│   └── api/
│       ├── auth/[...nextauth]/     ← NextAuth handler
│       ├── submissions/route.ts    ← Handle new submissions
│       └── override/route.ts      ← Handle manual overrides
├── components/
│   ├── DashboardSearch.tsx         ← Search and filter
│   └── OverrideForm.tsx            ← Manual override form
├── lib/
│   ├── prisma.ts                   ← Prisma client singleton
│   ├── auth.ts                     ← NextAuth configuration
│   ├── supabase.ts                 ← Supabase client
│   ├── faceapi.ts                  ← Face++ API wrapper
│   └── schemas.ts                  ← Zod validation schemas
└── prisma/
    ├── schema.prisma               ← Database schema
    └── seed.ts                     ← Faker.js seed script
```

---

## Database Schema

**businesses** — stores business accounts
**verifications** — stores every customer submission including check results and status

---

## Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/kycflow.git
cd kycflow
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the root with these values:
```
DATABASE_URL="your-supabase-pooler-url"
DIRECT_URL="your-supabase-direct-url"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-supabase-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
FACEPP_API_KEY="your-facepp-key"
FACEPP_API_SECRET="your-facepp-secret"
```

**4. Push the database schema**
```bash
npx prisma db push
```

**5. Seed the database**
```bash
npx tsx prisma/seed.ts
```

**6. Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## The Interview Story

> "KYC Flow came from asking what the full self-service product would look like if those ML capabilities were available to any business. The interesting technical challenge was building two completely different user experiences in one Next.js application, a public customer portal with no authentication and a protected business dashboard with NextAuth session management. Two user types, two interfaces, one codebase."

---

## Author

**Kevin Ziyada Aseru**
Flutter, frontend and AI/ML Developer | Kampala, Uganda
- Technical Lead, Research Code Resolve
- Business Technology Apprentice, E&M Technology House
