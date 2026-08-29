import type { ClaimStatus } from '@/types/claim';

/**
 * Helper to create a Date relative to today.
 * Negative values = days in the past, positive = days in the future.
 */
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─── Scenario A: Employer Blocker ───────────────────────────────────────────
const claimA: ClaimStatus = {
  uan: '123456789012',
  claimId: 'CLM-2026-A78912',
  claimType: 'withdrawal',
  amount: 250000,
  filingDate: daysAgo(15),
  memberName: 'Priya Sharma',
  employerName: 'TechVista Solutions Pvt Ltd',
  currentStage: 'employerApproval',
  stages: {
    employerApproval: {
      status: 'blocked',
      enteredAt: daysAgo(15),
      blockerReason: 'Employer has not updated Date of Exit in EPFO system',
    },
    kycVerification: {
      status: 'pending',
      enteredAt: daysAgo(15),
    },
    epfoSanction: {
      status: 'pending',
      enteredAt: daysAgo(15),
    },
    paymentProcessing: {
      status: 'pending',
      enteredAt: daysAgo(15),
    },
  },
};

// ─── Scenario B: KYC Mismatch ───────────────────────────────────────────────
const claimB: ClaimStatus = {
  uan: '987654321098',
  claimId: 'CLM-2026-B45623',
  claimType: 'withdrawal',
  amount: 180000,
  filingDate: daysAgo(10),
  memberName: 'Rajesh Kumar Sharma',
  employerName: 'BrightSteel Manufacturing',
  currentStage: 'kycVerification',
  stages: {
    employerApproval: {
      status: 'completed',
      enteredAt: daysAgo(10),
      completedAt: daysAgo(8),
    },
    kycVerification: {
      status: 'blocked',
      enteredAt: daysAgo(8),
      blockerReason:
        'Name mismatch — PAN: "Rajesh Kr Sharma", Aadhaar: "Rajesh Kumar Sharma"',
    },
    epfoSanction: {
      status: 'pending',
      enteredAt: daysAgo(8),
    },
    paymentProcessing: {
      status: 'pending',
      enteredAt: daysAgo(8),
    },
  },
};

// ─── Scenario C: Normal Processing ──────────────────────────────────────────
const claimC: ClaimStatus = {
  uan: '555555555555',
  claimId: 'CLM-2026-C99102',
  claimType: 'loan',
  amount: 500000,
  filingDate: daysAgo(3),
  memberName: 'Ananya Patel',
  employerName: 'Cloudbridge IT Services',
  currentStage: 'epfoSanction',
  estimatedSettlement: daysAgo(-2), // 2 days from now
  stages: {
    employerApproval: {
      status: 'completed',
      enteredAt: daysAgo(3),
      completedAt: daysAgo(2),
    },
    kycVerification: {
      status: 'completed',
      enteredAt: daysAgo(2),
      completedAt: daysAgo(1),
    },
    epfoSanction: {
      status: 'in_progress',
      enteredAt: daysAgo(1),
    },
    paymentProcessing: {
      status: 'pending',
      enteredAt: daysAgo(1),
    },
  },
};

// ─── Scenario D: Settled Successfully ───────────────────────────────────────
const claimD: ClaimStatus = {
  uan: '111111111111',
  claimId: 'CLM-2026-D33210',
  claimType: 'pension',
  amount: 320000,
  filingDate: daysAgo(8),
  memberName: 'Suresh Reddy',
  employerName: 'National Textiles Ltd',
  currentStage: 'paymentProcessing',
  estimatedSettlement: daysAgo(1),
  stages: {
    employerApproval: {
      status: 'completed',
      enteredAt: daysAgo(8),
      completedAt: daysAgo(6),
    },
    kycVerification: {
      status: 'completed',
      enteredAt: daysAgo(6),
      completedAt: daysAgo(5),
    },
    epfoSanction: {
      status: 'completed',
      enteredAt: daysAgo(5),
      completedAt: daysAgo(2),
    },
    paymentProcessing: {
      status: 'completed',
      enteredAt: daysAgo(2),
      completedAt: daysAgo(1),
    },
  },
};

/** All demo claims indexed by UAN. */
const CLAIMS_DB: Record<string, ClaimStatus> = {
  '123456789012': claimA,
  '987654321098': claimB,
  '555555555555': claimC,
  '111111111111': claimD,
};

/** Look up a claim by UAN. Returns null when not found. */
export function getClaimByUAN(uan: string): ClaimStatus | null {
  return CLAIMS_DB[uan.trim()] ?? null;
}

/** Return every mock claim (useful for dashboards / lists). */
export function getAllClaims(): ClaimStatus[] {
  return Object.values(CLAIMS_DB);
}
