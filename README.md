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
