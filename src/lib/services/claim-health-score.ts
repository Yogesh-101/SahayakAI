import type { ClaimStatus } from '@/types/claim';
import { STAGE_ORDER } from '@/types/claim';

export type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical' | 'settled';

export interface ClaimHealthResult {
  score: number;
  status: HealthStatus;
  label: string;
  summary: string;
  daysInCurrentStage: number;
}

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - new Date(from).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function calculateClaimHealth(claim: ClaimStatus): ClaimHealthResult {
  const allCompleted = STAGE_ORDER.every(
    (key) => claim.stages[key].status === 'completed',
  );

  if (allCompleted) {
    return {
      score: 100,
      status: 'settled',
      label: 'Settled',
      summary: 'All stages completed — amount credited or processing finished.',
      daysInCurrentStage: 0,
    };
  }

  const completedCount = STAGE_ORDER.filter(
    (key) => claim.stages[key].status === 'completed',
  ).length;

  const current = claim.stages[claim.currentStage];
  const daysInStage = daysBetween(current.enteredAt, new Date());

  let score = 20 + completedCount * 18;

  if (current.status === 'in_progress') {
    score += 12;
  } else if (current.status === 'blocked') {
    score -= 28;
  } else if (current.status === 'pending') {
    score -= 8;
  }

  if (daysInStage > 20) score -= 22;
  else if (daysInStage > 14) score -= 14;
  else if (daysInStage > 7) score -= 8;

  score = Math.max(5, Math.min(95, Math.round(score)));

  let status: HealthStatus;
  let label: string;
  let summary: string;

  if (current.status === 'blocked') {
    status = score < 35 ? 'critical' : 'warning';
    label = status === 'critical' ? 'Blocked — Action Needed' : 'Delayed — Blocker Detected';
    summary =
      current.blockerReason ??
      'Your claim is stuck at the current stage and needs your attention.';
  } else if (score >= 75) {
    status = 'good';
    label = 'On Track';
    summary = 'Your claim is progressing normally through the pipeline.';
  } else if (score >= 50) {
    status = 'warning';
    label = 'Needs Attention';
    summary = 'Processing is slower than typical — monitor the current stage closely.';
  } else {
    status = 'critical';
    label = 'At Risk';
    summary = 'Significant delay detected — review diagnosis and take action soon.';
  }

  return {
    score,
    status,
    label,
    summary,
    daysInCurrentStage: daysInStage,
  };
}
