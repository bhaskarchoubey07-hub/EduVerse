# EduVerse AI — Authentication & Free AI Backend Guide

This document outlines the free-first production setup for **Supabase Authentication & PostgreSQL Database** and **Google Gemini 1.5 Flash AI API**.

---

## 1. Quick Architecture Overview

```
Student Browser (PWA / Mobile / Desktop)
      │
      ▼
Next.js App Server (EduVerse Backend)
      ├─► Supabase Auth (JWT verification & session check)
      ├─► Rate Limiter (AI_DAILY_MESSAGE_LIMIT check)
      ├─► Educational Context Layer (Verified NCERT / Board Syllabus Grounding)
      └─► Google Gemini API (Server-side key, zero client leakage)
```

---

## 2. Setting Up Free Supabase (Auth + PostgreSQL)

### Step A: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in (Free Tier).
2. Click **New Project**.
3. Choose an organization, enter a name (e.g. `eduverse-ai`), choose a database password, and select your closest region (e.g. `ap-south-1` Mumbai).
4. Wait 1-2 minutes for the database to provision.

### Step B: Run the Database Migration
1. In your Supabase dashboard, click the **SQL Editor** tab on the left sidebar.
2. Click **New query**.
3. Open `supabase/schema.sql` from this repository.
4. Copy all contents, paste into the SQL Editor, and click **Run**.
5. This automatically configures:
   - `profiles` table (linked to `auth.users`)
   - `student_progress` table
   - `saved_items` table
   - `ai_conversations` and `ai_messages` tables
   - `mock_results` table
   - `study_sessions` table
   - `user_gamification` table
   - `ai_usage_tracking` table
   - Row Level Security (RLS) policies on every table
   - High-performance query indexes
   - The `handle_new_user()` trigger to automatically create profile records upon student signup.

### Step C: Enable Email Authentication & Configure Redirects
1. Go to **Authentication** $\to$ **Providers** $\to$ **Email**.
2. Ensure **Enable Email provider** is turned **ON**.
3. (Optional for production) To enforce email verification, keep **Confirm email** enabled. For local testing, you can toggle it off if you want immediate logins without email verification.
4. Go to **Authentication** $\to$ **URL Configuration**.
5. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.vercel.app`
6. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/login`
   - `http://localhost:3000/auth/reset-password`
   - `https://your-domain.vercel.app/**`

### Step D: Retrieve API Credentials
1. Go to **Project Settings** (gear icon) $\to$ **API**.
2. Copy:
   - **Project URL** $\to$ `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys: anon public** $\to$ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API keys: service_role** (Secret) $\to$ `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Setting Up Free Google Gemini AI API

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with any standard Google account.
3. Click **Get API key** $\to$ **Create API key**.
4. Copy the generated secret key.
5. The free tier gives generous requests per minute for `gemini-1.5-flash`, which is fast, cost-free, and optimized for educational instruction.

---

## 4. Environment Variables Configuration

Create a file named `.env.local` in the project root (this file is git-ignored):

```bash
# -------------------------------------------------------------
# SUPABASE AUTHENTICATION & DATABASE (FREE TIER)
# -------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# -------------------------------------------------------------
# GOOGLE GEMINI AI API (SERVER-SIDE ONLY - NEVER COMMIT)
# -------------------------------------------------------------
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-1.5-flash

# -------------------------------------------------------------
# RATE LIMITING & APPLICATION CONFIGURATION
# -------------------------------------------------------------
AI_DAILY_MESSAGE_LIMIT=20
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

> [!NOTE]
> If you run the app **without** `.env.local`, EduVerse AI automatically defaults to its built-in offline educational provider and demo profiles so nothing ever crashes during initial evaluation.

---

## 5. Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build validation
npm run build
```

---

## 6. Testing Authentication & Features

### 1. Test Registration
1. Navigate to `/auth/register`.
2. Enter Name, Email, Password, Class (e.g. 10), Board (e.g. CBSE), Preferred Language (e.g. Hinglish).
3. If Supabase email confirmation is enabled, you will see the **Check your inbox to verify** confirmation screen with a working **Resend Verification Link** button.

### 2. Test Login & Session Persistence
1. Navigate to `/auth/login`.
2. Sign in with your registered credentials or click **One-Click Instant Preview Accounts** (`Demo Student` or `Demo Admin`).
3. Refresh the browser; verify that your session persists smoothly.
4. Click Logout from the user menu; verify that private routes like `/dashboard` and `/tutor` securely redirect to `/auth/login?redirect=...`.

### 3. Test Password Reset
1. Go to `/auth/forgot-password`.
2. Enter your email; submit to receive the Supabase reset token.
3. Access `/auth/reset-password` to establish a new password.

### 4. Test AI Tutor & Server-Side Security
1. Open `/tutor` or ask a question from any chapter page.
2. Note the educational grounding badge:
   `[AI-GENERATED STUDY EXPLANATION - GROUNDED IN CBSE SYLLABUS]`.
3. Try asking about **Double circulation** or **Ohm's law**; observe the step-by-step formula and exam scoring tips.
4. Verify that the client browser never exposes the `GEMINI_API_KEY` (inspect network tab $\to$ only calls `/api/ai/chat` or `/api/tutor`).

---

## 7. Security & Privacy Audit Checklist

- [x] **Zero Client Secret Leakage**: `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are only ever read in server-side routes (`/api/ai/chat`, `/api/tutor`).
- [x] **Row Level Security (RLS)**: Enforced across all tables in `supabase/schema.sql`. User A cannot inspect User B's progress, notes, or AI conversations.
- [x] **Anti-Abuse Rate Limiting**: Server-side rate limiter enforces configurable daily limits (default 20/day) before external AI calls.
- [x] **Protected Routes Guard**: Unauthenticated users are redirected to login with full `?redirect=` restoration.
- [x] **Offline Resilient**: Built-in pedagogical fallback provider guarantees platform availability even during external API downtime.
