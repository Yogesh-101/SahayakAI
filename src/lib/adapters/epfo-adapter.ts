import type { ClaimStatus } from '@/types/claim';
import { getClaimByUAN } from '@/lib/mock-data/claims';

/**
 * ⚠️ MOCK IMPLEMENTATION
 *
 * In production this would call the real EPFO Unified Member Portal API at
 * https://unifiedportal-mem.epfindia.gov.in/memberInterface/api/
 *
 * The adapter pattern lets us swap this mock with a real HTTP client
 * without changing any business logic or UI code.
 */

/** Simulate network latency so the UI loading states can be tested. */
function simulateLatency(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch the current status of an EPFO claim.
 *
 * @param uan  - Universal Account Number of the member
 * @param _claimId - Claim reference (unused in mock, kept for API parity)
 * @returns The full ClaimStatus object
 * @throws {Error} When the UAN is not found in the mock database
 */
export async function fetchClaimStatus(
  uan: string,
  _claimId?: string,
): Promise<ClaimStatus> {
  console.log(`[MOCK EPFO API] Fetching claim for UAN: ${uan}`);

  await simulateLatency(500);

  const claim = getClaimByUAN(uan);

  if (!claim) {
    throw new Error(
      `Claim not found for UAN ${uan}. Try one of the demo UANs: 123456789, 987654321, 555555555, 111111111`,
    );
  }

  console.log(
    `[MOCK EPFO API] Found claim ${claim.claimId} — stage: ${claim.currentStage}`,
  );

  return claim;
}
