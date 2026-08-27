# SahayakAI — System Architecture

## High-Level Flow

```
Citizen (Web / WhatsApp / Voice)
        │
        ▼
┌─────────────────────────┐
│   Next.js Frontend      │  React 18, App Router, Tailwind CSS
│   (Pages + Components)  │  LanguageContext (i18n), ErrorBoundary
└───────────┬─────────────┘
            │ fetch()
            ▼
┌─────────────────────────┐
│   Next.js API Routes    │  /api/claim/status   → Mock EPFO adapter
│   (Server-side)         │  /api/claim/diagnose → Diagnosis service
└───────────┬─────────────┘
            │
    ┌───────┼───────┐
    ▼       ▼       ▼
┌───────┐ ┌─────┐ ┌──────┐
│ EPFO  │ │OpenAI│ │Rules │
│Adapter│ │ API  │ │Engine│
└───────┘ └─────┘ └──────┘
  (Mock)    (GPT)   (Fallback)
```

## Architecture Decisions

### 1. Server-Side AI Calls

The OpenAI diagnosis runs **server-side** via `/api/claim/diagnose` route handler. This ensures:
- API key never reaches the client bundle
- Secure token handling via `process.env.OPENAI_API_KEY`
- Fallback to rule-based engine when no key is configured

### 2. Adapter Pattern for External APIs

All government services are accessed through adapters in `src/lib/adapters/`:

```
┌──────────────────┐     ┌──────────────────┐
│   epfo-adapter   │────▶│  Mock Data       │  (Demo)
│                  │     └──────────────────┘
│   Interface:     │     ┌──────────────────┐
│   fetchClaim()   │────▶│  Real EPFO API   │  (Production)
└──────────────────┘     └──────────────────┘
```

Swapping from mock to production requires changing only the adapter implementation — zero UI changes.

### 3. Client/Server Boundary

```
Server Components (layout.tsx)
   └── LanguageProvider (client)
        └── Page Components (client)
             ├── DiagnosisPanel → fetches /api/claim/diagnose
             ├── WhatsAppPreview → client-only mock
             └── VoiceInput → client-only mock
```

Pages are `'use client'` because they use React hooks (useState, useEffect, useContext).
The diagnosis API call crosses the client/server boundary via `fetch()`.

### 4. Diagnosis Service — Dual Engine

```
Request → /api/claim/diagnose (POST)
   │
   ├── OpenAI available? → GPT-3.5-Turbo analysis
   │      └── Parse JSON → Validate → Return Diagnosis
   │
   └── No API key? → Rule-based engine
          └── Match stage + status + duration → Return Diagnosis
```

Both engines return the same `Diagnosis` interface, making the AI transparent to the UI.

### 5. Internationalization (i18n)

```
LanguageContext (React Context)
   ├── language: 'en' | 'hi'
   ├── setLanguage() → persists to localStorage
   └── t(key) → lookup in translations map
```

Translations live in the context file, not separate JSON files, for hackathon simplicity.
Production would use a proper i18n library like `next-intl`.

## Directory Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── api/                 # Server-side API routes
│   │   └── claim/
│   │       ├── diagnose/    # POST: AI diagnosis (server-side OpenAI)
│   │       └── status/      # GET: Claim lookup
│   ├── claim/
│   │   ├── check/           # UAN input form
│   │   └── [id]/            # Dynamic claim detail page
│   ├── demo/                # Interactive demo walkthrough
│   └── layout.tsx           # Root layout + providers
│
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   │   ├── button, card, badge, dialog, toast, spinner, skeleton
│   │   ├── toaster.tsx      # Toast notification container
│   │   └── use-toast.ts     # Toast state management hook
│   ├── ClaimStatusTimeline  # Visual stage progress
│   ├── DiagnosisPanel       # AI diagnosis + resolution
│   ├── WhatsAppPreview      # Mock notification UI
│   ├── VoiceInput           # Mock BHASHINI voice
│   ├── BeforeAfterComparison# EPFO vs SahayakAI
│   ├── LanguageToggle       # EN/HI switcher
│   └── ErrorBoundary        # React error boundary
│
├── contexts/
│   └── LanguageContext       # i18n provider + translations
│
├── lib/
│   ├── adapters/
│   │   └── epfo-adapter     # Mock EPFO API (swap for production)
│   ├── services/
│   │   ├── diagnosis-service # OpenAI + rule-based fallback
│   │   └── resolution-guides # Step-by-step fix guides
│   ├── mock-data/
│   │   └── claims           # 4 demo scenarios
│   └── utils.ts             # cn() class merge utility
│
└── types/
    ├── claim.ts             # ClaimStatus, StageStatus, ClaimStages
    └── diagnosis.ts         # Diagnosis, NotificationEvent
```

## Data Flow: Claim Check

```
1. User enters UAN on /claim/check
2. Client calls epfo-adapter.fetchClaimStatus(uan)
3. Adapter returns mock ClaimStatus (500ms simulated latency)
4. Router navigates to /claim/{uan}
5. Page fetches claim again and renders:
   a. Summary card (amount, dates, employer)
   b. ClaimStatusTimeline (4 stages)
   c. DiagnosisPanel → POST /api/claim/diagnose
   d. WhatsAppPreview (generated from claim data)
```

## Security Considerations

- **API Keys**: `OPENAI_API_KEY` is server-only (no `NEXT_PUBLIC_` prefix)
- **Input Validation**: UAN sanitized before lookup
- **CORS**: Next.js API routes are same-origin by default
- **XSS**: React's JSX escaping prevents injection
- **Demo Mode**: All mock data clearly labeled in UI

## Production Migration Path

| Component | Demo (Current) | Production |
|-----------|---------------|------------|
| EPFO Data | Mock adapter | Real EPFO Unified Portal API |
| AI Diagnosis | OpenAI GPT-3.5 | OpenAI GPT-4 + fine-tuned model |
| Notifications | UI preview | WhatsApp Business API |
| Voice Input | Mock transcript | BHASHINI REST API |
| KYC Verification | N/A | DigiLocker API |
| Database | In-memory | PostgreSQL / Supabase |
| Auth | None | EPFO OAuth + Aadhaar OTP |
| Deployment | localhost | Vercel / NIC Cloud |
