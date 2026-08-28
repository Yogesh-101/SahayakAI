import type { ClaimStatus, ClaimStages, StageStatus } from '@/types/claim';

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function parseStageStatus(raw: Record<string, unknown>): StageStatus {
  return {
    status: raw.status as StageStatus['status'],
    enteredAt: toDate(raw.enteredAt as Date | string),
    completedAt: raw.completedAt
      ? toDate(raw.completedAt as Date | string)
      : undefined,
    blockerReason: raw.blockerReason as string | undefined,
  };
}

/** Revive ISO date strings from JSON API responses into Date objects. */
export function parseClaimStatus(raw: Record<string, unknown>): ClaimStatus {
  const stages = raw.stages as Record<string, Record<string, unknown>>;
  const parsedStages = {} as ClaimStages;

  for (const key of Object.keys(stages) as (keyof ClaimStages)[]) {
    parsedStages[key] = parseStageStatus(stages[key]);
  }

  return {
    uan: raw.uan as string,
    claimId: raw.claimId as string,
    claimType: raw.claimType as ClaimStatus['claimType'],
    amount: raw.amount as number,
    memberName: raw.memberName as string,
    employerName: raw.employerName as string,
    currentStage: raw.currentStage as keyof ClaimStages,
    filingDate: toDate(raw.filingDate as Date | string),
    estimatedSettlement: raw.estimatedSettlement
      ? toDate(raw.estimatedSettlement as Date | string)
      : undefined,
    stages: parsedStages,
  };
}
