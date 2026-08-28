import type { ClaimStatus } from '@/types/claim';

/**
 * EPFO claim status adapter.
 *
 * Demo: calls `/api/claim/status` (mock data + simulated latency).
 * Production: swap this client to the real EPFO Unified Member Portal API.
 */

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

  const response = await fetch(
    `/api/claim/status?uan=${encodeURIComponent(uan)}`,
    { cache: 'no-store' },
  );

  const payload = (await response.json()) as { claim?: ClaimStatus; error?: string };

  if (!response.ok) {
    throw new Error(
      payload.error ??
        `Claim not found for UAN ${uan}. Try one of the demo UANs: 123456789, 987654321, 555555555, 111111111`,
    );
  }

  if (!payload.claim) {
    throw new Error(`Claim not found for UAN ${uan}.`);
  }

  console.log(
    `[MOCK EPFO API] Found claim ${payload.claim.claimId} — stage: ${payload.claim.currentStage}`,
  );

  return payload.claim;
}
