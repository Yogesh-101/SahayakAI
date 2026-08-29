import type { ClaimStatus } from '@/types/claim';
import { STAGE_ORDER } from '@/types/claim';
import { calculateClaimHealth } from '@/lib/services/claim-health-score';

export type ClaimTabSlug =
  | 'timeline'
  | 'diagnosis'
  | 'analytics'
  | 'rights'
  | 'alerts';

export const CLAIM_JOURNEY: ClaimTabSlug[] = [
  'timeline',
  'diagnosis',
  'analytics',
  'rights',
  'alerts',
];

export function isClaimSettled(claim: ClaimStatus): boolean {
  return STAGE_ORDER.every((key) => claim.stages[key].status === 'completed');
}

export function isClaimBlocked(claim: ClaimStatus): boolean {
  return claim.stages[claim.currentStage].status === 'blocked';
}

export function getDefaultTab(claim: ClaimStatus): ClaimTabSlug {
  if (isClaimSettled(claim)) return 'alerts';
  if (isClaimBlocked(claim)) return 'diagnosis';
  return 'timeline';
}

export interface NextStepInfo {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  urgent: boolean;
}

export function getNextStepInfo(
  claim: ClaimStatus,
  uan: string,
  t: (key: string) => string,
): NextStepInfo | null {
  if (isClaimSettled(claim)) {
    return {
      title: t('next_step_settled_title'),
      description: t('next_step_settled_desc'),
      ctaLabel: t('tab_alerts'),
      href: `/claim/${uan}/alerts`,
      urgent: false,
    };
  }

  const current = claim.stages[claim.currentStage];
  const health = calculateClaimHealth(claim);

  if (current.status === 'blocked') {
    return {
      title: t('next_step_blocked_title'),
      description:
        current.blockerReason ??
        health.summary,
      ctaLabel: t('next_step_fix_cta'),
      href: `/claim/${uan}/diagnosis`,
      urgent: true,
    };
  }

  if (health.daysInCurrentStage >= 7) {
    return {
      title: t('next_step_delay_title'),
      description: t('next_step_delay_desc').replace(
        '{days}',
        String(health.daysInCurrentStage),
      ),
      ctaLabel: t('next_step_rights_cta'),
      href: `/claim/${uan}/rights`,
      urgent: true,
    };
  }

  return {
    title: t('next_step_track_title'),
    description: t('next_step_track_desc'),
    ctaLabel: t('tab_status'),
    href: `/claim/${uan}/timeline`,
    urgent: false,
  };
}

export function getTabBadges(
  claim: ClaimStatus,
): Partial<Record<ClaimTabSlug, string>> {
  const badges: Partial<Record<ClaimTabSlug, string>> = {};
  const settled = isClaimSettled(claim);

  if (!settled && isClaimBlocked(claim)) {
    badges.diagnosis = '1';
  }
  if (!settled) {
    const health = calculateClaimHealth(claim);
    if (health.daysInCurrentStage >= 7) {
      badges.rights = '!';
    }
    if (health.status === 'warning' || health.status === 'critical') {
      badges.analytics = '₹';
    }
  }
  if (!settled) {
    badges.alerts = '●';
  }

  return badges;
}

export function getContinueRoute(
  currentTab: ClaimTabSlug,
  claim: ClaimStatus,
  uan: string,
): { href: string; labelKey: string } | null {
  const settled = isClaimSettled(claim);

  switch (currentTab) {
    case 'timeline':
      return settled
        ? { href: `/claim/${uan}/alerts`, labelKey: 'continue_to_alerts' }
        : { href: `/claim/${uan}/diagnosis`, labelKey: 'continue_to_fix' };
    case 'diagnosis':
      return { href: `/claim/${uan}/analytics`, labelKey: 'continue_to_compare' };
    case 'analytics':
      return settled
        ? { href: `/claim/${uan}/alerts`, labelKey: 'continue_to_alerts' }
        : { href: `/claim/${uan}/rights`, labelKey: 'continue_to_rights' };
    case 'rights':
      return { href: `/claim/${uan}/alerts`, labelKey: 'continue_to_alerts' };
    default:
      return null;
  }
}

export const PROBLEM_SCENARIOS: Array<{
  id: string;
  uan: string;
  tab: ClaimTabSlug;
  labelKey: string;
}> = [
  { id: 'employer', uan: '123456789', tab: 'diagnosis', labelKey: 'problem_employer' },
  { id: 'kyc', uan: '987654321', tab: 'diagnosis', labelKey: 'problem_kyc' },
  { id: 'processing', uan: '555555555', tab: 'timeline', labelKey: 'problem_processing' },
  { id: 'payment', uan: '555555555', tab: 'timeline', labelKey: 'problem_payment' },
];
