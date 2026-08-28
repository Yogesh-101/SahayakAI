# SahayakAI — System Architecture

## High-Level Flow

```
Citizen (Web / WhatsApp / Voice)
        │
        ▼
┌─────────────────────────────────────────┐
│   Next.js Frontend (React 18)           │
│   App Router · Tailwind · shadcn/ui     │
│   LanguageContext (EN/HI) · GovPageShell│
└───────────┬─────────────────────────────┘
            │ fetch()
            ▼
┌─────────────────────────────────────────┐
│   Next.js API Routes (Server-side)      │
│   GET  /api/claim/status                │
│   POST /api/claim/diagnose              │
└───────────┬─────────────────────────────┘
            │
    ┌───────┼───────────────┬──────────────┐
    ▼       ▼               ▼              ▼
┌───────┐ ┌─────┐   ┌────────────┐  ┌──────────┐
│ EPFO  │ │OpenAI│   │ Rule-based │  │ Client   │
│Adapter│ │ API  │   │  Engine    │  │ Services │
└───────┘ └─────┘   └────────────┘  └──────────┘
  (Mock)    (GPT)      (Fallback)    (KYC, Legal,
                                     Rights, Email)
```

## Feature Map

| Feature | UI Component | Service / Logic | Page |
|---------|-------------|-----------------|------|
| Stage Tracking | `ClaimStatusTimeline` | `epfo-adapter` | `/claim/[id]` |
| AI Diagnosis | `DiagnosisPanel` | `diagnosis-service` → `/api/claim/diagnose` | `/claim/[id]` |
| Resolution Steps | `DiagnosisPanel` | `resolution-guides` | `/claim/[id]` |
| Smart Email | `EmailTracker` | `email-generator` | `/claim/[id]` |
| Peer Comparison | `PeerComparison` | Mock analytics (inline) | `/claim/[id]` |
| Financial Impact | `FinancialImpact` | Inline calculation | `/claim/[id]` |
| Know Your Rights | `RightsPanel` | `rights-engine` | `/claim/[id]` |
| WhatsApp Preview | `WhatsAppPreview` | Generated from claim data | `/claim/[id]` |
| KYC Health Check | `KYCHealthScore` | `kyc-validator` | `/tools/kyc-check` |
| Legal Escalation | Escalate page UI | `legal-document-generator` | `/tools/escalate` |
| Multilingual UI | `LanguageToggle` | `LanguageContext` | All pages |
| Gov Layout | `GovPageShell` | Breadcrumbs, footer, top bar | Inner pages |

## Architecture Decisions

### 1. Server-Side AI Calls

OpenAI diagnosis runs **server-side** via `/api/claim/diagnose`:
- API key never reaches the client bundle
- Secure via `process.env.OPENAI_API_KEY`
- Falls back to rule-based engine when no key is configured

### 2. Adapter Pattern for External APIs

All government services use adapters in `src/lib/adapters/`:

```
┌──────────────────┐     ┌──────────────────┐
│   epfo-adapter   │────▶│  Mock Data       │  (Demo)
│   fetchClaim()   │     └──────────────────┘
│                  │     ┌──────────────────┐
│                  │────▶│  Real EPFO API   │  (Production)
└──────────────────┘     └──────────────────┘
```

Swapping mock → production requires only adapter changes — zero UI changes.

### 3. Client-Side Services for Empowerment Tools

KYC validation, legal document generation, rights engine, and email generation run **client-side** with mock data for the hackathon demo. In production these would call:
- EPFO KYC API / DigiLocker for KYC Health Check
- EPFiGMS / RTI Online APIs for legal escalation
- Email/SMS gateway for employer notifications

### 4. Shared Government Layout (`GovPageShell`)

Inner pages share a consistent shell:
- Slim government identity bar (Indian flag + "Government of India")
- Sticky header with logo, nav links, CTA
- Breadcrumb navigation
- Footer with helplines and EPFO resource links
- Scroll-to-top button

Homepage (`page.tsx`) uses its own inline header/hero/footer for the landing experience.

### 5. Diagnosis Service — Dual Engine

```
Request → POST /api/claim/diagnose
   │
   ├── OPENAI_API_KEY set? → GPT-3.5-Turbo analysis
   │      └── Parse JSON → Validate → Return Diagnosis
   │
   └── No API key? → Rule-based engine
          └── Match stage + status + duration → Return Diagnosis
```

Both engines return the same `Diagnosis` interface.

### 6. Internationalization (i18n)

```
LanguageContext (React Context)
   ├── language: 'en' | 'hi'
   ├── setLanguage() → persists to localStorage
   └── t(key) → lookup in translations map
```

Homepage, claim pages, tool pages, and GovPageShell all use `t()` for user-facing text.

## Directory Structure

```
src/
├── app/
│   ├── api/claim/
│   │   ├── diagnose/route.ts    # POST: server-side OpenAI diagnosis
│   │   └── status/route.ts      # GET: claim lookup
│   ├── claim/
│   │   ├── check/page.tsx       # UAN input + voice
│   │   └── [id]/page.tsx        # Claim dashboard (6 sections)
│   ├── tools/
│   │   ├── kyc-check/page.tsx   # KYC Health Checker
│   │   └── escalate/page.tsx    # Legal Escalation
│   ├── demo/page.tsx            # Judge walkthrough
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout + providers
│   └── globals.css              # EPFO animations + utilities
│
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── GovPageShell.tsx         # Shared gov layout
│   ├── ClaimStatusTimeline.tsx
│   ├── DiagnosisPanel.tsx
│   ├── EmailTracker.tsx
│   ├── PeerComparison.tsx
│   ├── FinancialImpact.tsx
│   ├── RightsPanel.tsx
│   ├── KYCHealthScore.tsx
│   ├── WhatsAppPreview.tsx
│   ├── VoiceInput.tsx
│   ├── BeforeAfterComparison.tsx
│   ├── LanguageToggle.tsx
│   └── ErrorBoundary.tsx
│
├── contexts/
│   └── LanguageContext.tsx
│
├── lib/
│   ├── adapters/
│   │   └── epfo-adapter.ts
│   ├── services/
│   │   ├── diagnosis-service.ts
│   │   ├── resolution-guides.ts
│   │   ├── email-generator.ts
│   │   ├── kyc-validator.ts
│   │   ├── legal-document-generator.ts
│   │   └── rights-engine.ts
│   ├── mock-data/
│   │   └── claims.ts            # 4 demo scenarios
│   └── utils.ts
│
└── types/
    ├── claim.ts
    └── diagnosis.ts
```

## Data Flow: Claim Dashboard

```
1. User enters UAN on /claim/check
2. Client calls epfo-adapter.fetchClaimStatus(uan)
3. Adapter returns mock ClaimStatus (~500ms simulated latency)
4. Router navigates to /claim/{uan}
5. GovPageShell wraps the page with gov header + breadcrumbs
6. Page renders 6 sections:
   a. Claim Overview (summary card)
   b. Status & Tracking (ClaimStatusTimeline)
   c. AI Diagnosis & Actions (DiagnosisPanel + EmailTracker)
   d. Analytics & Insights (PeerComparison + FinancialImpact)
   e. Legal Rights & Escalation (RightsPanel)
   f. Notifications (WhatsAppPreview)
```

## Data Flow: KYC Health Check

```
1. User enters UAN on /tools/kyc-check
2. Client calls validateKYC(uan) from kyc-validator.ts
3. Service cross-checks Name, DOB, PAN, Aadhaar across mock records
4. Returns KYCHealthResult with score, status, field checks, fix links
5. KYCHealthScore component renders traffic-light UI
```

## Data Flow: Legal Escalation

```
1. User enters UAN on /tools/escalate
2. Client fetches claim via epfo-adapter
3. legal-document-generator.ts produces:
   - EPFiGMS grievance (EPFO Circular references)
   - RTI application (RTI Act 2005)
   - CPGRAMS complaint (PM Office escalation)
4. User copies pre-filled documents to clipboard
```

## Security Considerations

- **API Keys**: `OPENAI_API_KEY` is server-only (no `NEXT_PUBLIC_` prefix)
- **Input Validation**: UAN sanitized before lookup
- **CORS**: Next.js API routes are same-origin by default
- **XSS**: React JSX escaping prevents injection
- **Demo Mode**: Mock integrations labeled in UI

## Production Migration Path

| Component | Demo (Current) | Production |
|-----------|---------------|------------|
| EPFO Data | Mock adapter | EPFO Unified Member Portal API |
| AI Diagnosis | OpenAI GPT-3.5 | GPT-4 + fine-tuned model |
| Notifications | UI preview | WhatsApp Business API |
| Voice Input | Mock transcript | BHASHINI REST API |
| KYC Verification | Mock cross-check | DigiLocker + EPFO KYC API |
| Legal Escalation | Template generation | EPFiGMS / RTI Online API submit |
| Email to Employer | Copy-to-clipboard | SMTP / transactional email API |
| Database | In-memory / localStorage | PostgreSQL / Supabase |
| Auth | None | EPFO OAuth + Aadhaar OTP |
| Deployment | localhost | Vercel / NIC Cloud |
