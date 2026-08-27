# 🚀 Pre-Submission Checklist

**Use this checklist before submitting to the hackathon**

---

## ✅ Core Features

- [x] **Homepage** with hero, stats, CTAs
- [x] **Claim Check Page** with UAN input + voice input
- [x] **Claim Detail Page** with:
  - [x] Stage-by-stage timeline
  - [x] AI bottleneck diagnosis
  - [x] Resolution guidance (step-by-step)
  - [x] WhatsApp notification preview
- [x] **Demo Page** (interactive guided walkthrough)
- [x] **Before/After Comparison** component
- [x] **Language Toggle** (English ↔ Hindi)
- [x] **4 Demo Scenarios**:
  - [x] `123456789` — Employer Block
  - [x] `987654321` — KYC Mismatch
  - [x] `555555555` — Normal Processing
  - [x] `111111111` — Settled

---

## 🎨 UI/UX Polish

- [x] Responsive design (mobile, tablet, desktop)
- [x] Custom Tailwind colors (Primary, Secondary, Danger, Warning)
- [x] shadcn/ui components (Button, Card, Badge, Dialog, Toast, Spinner)
- [x] Loading states (Spinner with "Checking..." text)
- [x] Error states (Error messages with retry CTAs)
- [x] Accessibility:
  - [x] ARIA labels
  - [x] Keyboard navigation
  - [x] Focus states
  - [x] Color contrast (WCAG AA)

---

## 🤖 AI & Integrations

- [x] OpenAI GPT-3.5-Turbo integration
- [x] Rule-based fallback (no API key required)
- [x] Mock EPFO API adapter
- [x] Mock WhatsApp notifications
- [x] Mock BHASHINI voice input
- [x] Environment variable configuration (`.env.local`)

---

## 📖 Documentation

- [x] **README.md** (comprehensive, with:
  - [x] Problem statement
  - [x] Solution overview
  - [x] Quick start guide
  - [x] Demo UANs
  - [x] Project structure
  - [x] Technical stack
  - [x] Production roadmap
  - [x] Judging criteria alignment
- [x] **DEMO_SCRIPT.md** (2-minute presentation guide)
- [x] **GETTING_STARTED.md** (this file)
- [x] **Code comments** (JSDoc for key functions)

---

## 🧪 Testing

### Manual Testing Checklist

**Homepage:**
- [ ] Visit `http://localhost:3000`
- [ ] Click "Check Claim Status" → Navigates to `/claim/check`
- [ ] Click "View Demo" → Navigates to `/demo`
- [ ] Toggle language (English ↔ Hindi) → UI updates
- [ ] Responsive: Test on mobile view (320px+)

**Claim Check:**
- [ ] Visit `/claim/check`
- [ ] Enter invalid UAN → Shows error
- [ ] Enter valid UAN (`123456789`) → Navigates to `/claim/123456789`
- [ ] Click voice input → Opens BHASHINI modal, auto-fills UAN after 2s
- [ ] Click demo badge UANs → Auto-fills and navigates

**Claim Detail (123456789 - Employer Block):**
- [ ] Stage timeline shows Stage 1 completed, Stage 2 blocked
- [ ] AI Diagnosis loads after 2s
- [ ] Diagnosis shows: "Employer has not approved" with 90%+ confidence
- [ ] Click "Show Resolution Steps" → Expands 5-step guide
- [ ] WhatsApp notifications show 3-4 messages
- [ ] Click "Check Another Claim" → Returns to `/claim/check`

**Claim Detail (987654321 - KYC Mismatch):**
- [ ] Stage 2 (KYC Verification) is blocked
- [ ] Diagnosis: "KYC documents don't match"
- [ ] Resolution: "Fix KYC" with portal navigation steps

**Claim Detail (555555555 - Processing):**
- [ ] All stages in progress or pending
- [ ] Diagnosis: "Normal processing"
- [ ] Resolution: "Wait for EPFO" with estimated timeline

**Claim Detail (111111111 - Settled):**
- [ ] All stages completed
- [ ] Green "Settled" badge
- [ ] Settlement message: "₹50,000 credited to bank account"
- [ ] WhatsApp shows final notification

**Demo Page:**
- [ ] Visit `/demo`
- [ ] Progress bar shows 1/6
- [ ] Step 1: Before/After comparison renders
- [ ] Click "Next" → Step 2 with demo UANs
- [ ] Quick navigation: Click "2. Try SahayakAI" → Jumps to step 2
- [ ] Click UAN card → Navigates to claim detail

---

## 🐛 Known Issues (Document if Any)

### Browser Extensions
- **Issue:** Hydration warnings from browser extensions (e.g., Retriever, Grammarly)
- **Fix:** Added `suppressHydrationWarning` to layout

### PowerShell
- **Issue:** `&&` not supported in PowerShell
- **Fix:** Run commands separately: `npm install` then `npm run dev`

---

## 📦 Pre-Deployment

### Build Test
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Production Preview
```bash
npm run build
npm run start
```
- [ ] Open `http://localhost:3000`
- [ ] Test all 4 demo UANs
- [ ] Verify all pages load correctly

---

## 🎥 Demo Video (TASK-013)

### Recording Setup
1. **Screen Recording Tool:** OBS Studio, Loom, or Zoom
2. **Resolution:** 1920x1080 (16:9)
3. **Audio:** Clear microphone (test first)
4. **Browser:** Chrome (clean profile, no extensions)

### Video Structure (2 minutes max)
1. **Hook (15s):** EPFO portal "Under Process" problem
2. **Solution (15s):** SahayakAI overview
3. **Before/After (20s):** Side-by-side comparison
4. **Live Demo (45s):** UAN 123456789 walkthrough
5. **Features (20s):** WhatsApp, voice, Hindi
6. **Impact (15s):** 60%+ reduction, 8 crore users, scalability

### Tips
- [ ] Practice 2-3 times before recording
- [ ] Keep cursor movements smooth
- [ ] Speak clearly and confidently
- [ ] Show enthusiasm (this solves a real problem!)
- [ ] End with strong call to action

---

## 📤 Submission

### Files to Include
- [ ] **Source code** (entire `sahayak-ai/` folder)
- [ ] **README.md**
- [ ] **DEMO_SCRIPT.md**
- [ ] **Demo video** (MP4, max 100MB)
- [ ] **.env.example** (NOT `.env.local`)
- [ ] **Screenshots** (optional: homepage, claim detail, demo)

### GitHub Repository (Recommended)
```bash
cd sahayak-ai
git init
git add .
git commit -m "Initial commit: SahayakAI for Build What Moves India Hackathon"
git branch -M main
git remote add origin https://github.com/yourusername/sahayak-ai.git
git push -u origin main
```

### Deployment (Optional but Impressive)
**Vercel (Easiest):**
```bash
npm install -g vercel
vercel
```
- Add `OPENAI_API_KEY` in Vercel dashboard (Environment Variables)
- Get production URL: `https://sahayak-ai.vercel.app`

---

## 🏆 Final Confidence Check

Before submitting, ask yourself:

- [ ] **Does it work?** Can a judge run `npm install && npm run dev` and see the full demo?
- [ ] **Is it impressive?** Does it show technical depth (AI, India Stack, Next.js 14)?
- [ ] **Does it solve a real problem?** Is the EPFO pain point clear?
- [ ] **Is it scalable?** Can this pattern apply to other government services?
- [ ] **Is it demonstrable?** Can you walk through 4 scenarios in 2 minutes?

If yes to all → **You're ready to submit!** 🎉

---

## 🆘 Last-Minute Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run build
```

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### OpenAI API Key Not Working
- Check `.env.local` file exists
- Verify key format: `OPENAI_API_KEY=sk-proj-...`
- Restart dev server
- **Fallback:** App works without API key (rule-based diagnosis)

### TypeScript Errors
```bash
npm run lint
# Fix reported issues, then rebuild
npm run build
```

---

## ✅ Submission Confirmation

Once submitted:
- [ ] Confirmation email received
- [ ] Repository is public (if using GitHub)
- [ ] Demo video is accessible
- [ ] Team members are listed
- [ ] Contact information is correct

---

**You did it! 🚀 Good luck at the hackathon!**

*Remember: Your project solves a real problem for 8 crore+ Indians. That's powerful. Present it with confidence.*
