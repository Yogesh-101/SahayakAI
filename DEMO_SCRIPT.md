# SahayakAI — 2-Minute Submission Video Script

**Hackathon prototype · Sample data only · Not affiliated with EPFO or Government of India**

**Live demo:** [https://sahayak-ai-brown.vercel.app](https://sahayak-ai-brown.vercel.app)  
**Guided tour:** [https://sahayak-ai-brown.vercel.app/demo](https://sahayak-ai-brown.vercel.app/demo)

---

## Structure (strict 2:00)

| Block | Time | What to show |
|-------|------|----------------|
| **Minute 1** | 0:00–1:00 | Demo as a **citizen** — problem → check UAN → Status tab → Fix & next steps |
| **Minute 2** | 1:00–2:00 | How you **built** it and **why** — stack, OpenAI, mock data, design choices |

---

# MINUTE 1 — Citizen demo (0:00–1:00)

### 0:00–0:15 — The problem (homepage)

**Say:**  
*"When I filed my PF withdrawal, the EPFO portal only showed UNDER PROCESS for weeks. SahayakAI lets any citizen enter their 12-digit UAN and see real stage-by-stage progress — starting with a clear Status view."*

**Do:**
1. Click **Check Claim Status** → `/claim/check`
2. Click demo chip **`123456789012`** (Employer block) — or use **Welcome back** if you checked before
3. Click **Check Status**

---

### 0:15–0:45 — Claim dashboard (Status-first journey)

**Say:**  
*"Every UAN opens on the Status tab first — not buried in menus. I see four stages: Employer, KYC, EPFO Sanction, Payment. This claim is blocked at Employer Approval."*

**Show on `/claim/123456789012/timeline`:**
- **Timeline** — blocked at Employer Approval
- **Next Step card** — click **See how to fix**

**Say:**  
*"The Fix tab gives AI diagnosis in plain language, confidence score, and a checklist I can copy or read aloud."*

**Show on Fix tab:**
- AI diagnosis + **Show Resolution Steps**
- One checklist item (copy or call helpline)

---

### 0:45–1:00 — Quick extra (pick one)

**Option A — Compare tab:**  
*"Compare shows peer delay and daily rupee loss — makes the delay tangible."*

**Option B — KYC pre-check:**  
`/tools/kyc-check` → UAN **`987654321098`** → **Check KYC** — *"Citizens can catch document mismatches before filing."*

**Close minute 1:**  
*"That's the citizen journey — from confusion to clarity in under a minute."*

---

# MINUTE 2 — How you built it & why (1:00–2:00)

### 1:00–1:20 — Stack & architecture

**Say:**  
*"I built SahayakAI with Next.js 16 and TypeScript. All EPFO data is sample/mock — we never hit live government systems. An adapter layer means production could swap in real APIs without rewriting the UI."*

**Mention:**
- Routes: `/claim/check` → `/claim/[uan]/timeline` (Status-first)
- Mock APIs: `/api/claim/status`, `/api/claim/diagnose`
- Rule-based diagnosis fallback when OpenAI quota isn't available

---

### 1:20–1:40 — OpenAI & features

**Say:**  
*"OpenAI powers bottleneck diagnosis when available. I also built KYC health check, legal escalation (EPFiGMS, RTI, CPGRAMS), WhatsApp alert previews, and Hindi + English UI."*

**If GPT works live:** Point at **GPT-3.5 powered** badge.  
**If rule fallback:** *"Today it's rule-based demo mode, but the OpenAI integration is wired."*

---

### 1:40–1:55 — Design & trust

**Say:**
- *"Sample data badge in the breadcrumb — honest about hackathon scope."*
- *"Mobile bottom tabs, 44px tap targets, Call EPFO FAB on blocked claims."*
- *"Judges: start at `/demo` — 9-step guided tour, Explore mode by default."*

---

### 1:55–2:00 — Closing line

**Say:**  
*"SahayakAI turns UNDER PROCESS into transparency — for 8 crore EPFO members who deserve to know where their money is and what to do next. Thank you."*

---

## Demo UANs (12-digit — keep handy)

| UAN | Use in video |
|-----|----------------|
| `123456789012` | **Main demo** — employer block, diagnosis, resolution |
| `987654321098` | KYC mismatch (optional 0:45–1:00) |
| `555555555555` | Normal processing |
| `111111111111` | Settled claim + WhatsApp alerts |

---

## Recording checklist

- [ ] Incognito browser (fewer extension/console warnings)
- [ ] `npm run dev` at `http://localhost:3000` **or** live Vercel URL
- [ ] Screen record at 1080p, face cam optional
- [ ] Toggle **Hindi** once to show i18n (optional, 5 sec)
- [ ] Rehearse once with a timer — **hard stop at 2:00**

---

## Judge quick path (no video)

1. [sahayak-ai-brown.vercel.app/demo](https://sahayak-ai-brown.vercel.app/demo) → Explore or Guided Tour  
2. Step 2 → click `123456789012` → lands on **Status**  
3. **See how to fix** → Fix tab → resolution checklist  
4. **Compare** → financial impact  
5. **Rights** → legal guidance  
6. **Alerts** → WhatsApp preview  
7. `/tools/kyc-check` and `/tools/escalate` as standalone tools
