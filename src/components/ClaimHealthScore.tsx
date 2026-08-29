'use client';

import { Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ClaimStatus } from '@/types/claim';
import {
  calculateClaimHealth,
  type HealthStatus,
} from '@/lib/services/claim-health-score';

interface ClaimHealthScoreProps {
  claim: ClaimStatus;
}

const STATUS_STYLES: Record<
  HealthStatus,
  { ring: string; fill: string; text: string; badge: string }
> = {
  settled: {
    ring: 'stroke-green-500',
    fill: 'text-green-600',
    text: 'text-green-900',
    badge: 'bg-green-100 text-green-800 border-green-200',
  },
  excellent: {
    ring: 'stroke-green-500',
    fill: 'text-green-600',
    text: 'text-green-900',
    badge: 'bg-green-100 text-green-800 border-green-200',
  },
  good: {
    ring: 'stroke-blue-500',
    fill: 'text-blue-600',
    text: 'text-blue-900',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  warning: {
    ring: 'stroke-amber-500',
    fill: 'text-amber-600',
    text: 'text-amber-900',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  critical: {
    ring: 'stroke-red-500',
    fill: 'text-red-600',
    text: 'text-red-900',
    badge: 'bg-red-100 text-red-800 border-red-200',
  },
};

function ScoreRing({ score, status }: { score: number; status: HealthStatus }) {
  const styles = STATUS_STYLES[status];
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-gray-200"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={styles.ring}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xl font-bold ${styles.fill}`}>{score}</span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wide">
          / 100
        </span>
      </div>
    </div>
  );
}

export default function ClaimHealthScore({ claim }: ClaimHealthScoreProps) {
  const { t } = useLanguage();
  const health = calculateClaimHealth(claim);
  const styles = STATUS_STYLES[health.status];

  return (
    <Card className="gov-card border-gray-200 overflow-hidden" id="claim-health-score">
      <div className="h-1 bg-gradient-to-r from-[#5e72e4] via-[#7c3aed] to-[#f8c8dc]" />
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start gap-4">
          <ScoreRing score={health.score} status={health.status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Activity className="w-4 h-4 text-[#1a237e]" />
              <h2 className="text-sm font-bold text-[#1a237e]">
                {t('claim_health_title')}
              </h2>
              <Badge variant="outline" className={`text-[10px] ${styles.badge}`}>
                {health.label}
              </Badge>
            </div>
            <p className={`text-sm font-medium ${styles.text}`}>{health.summary}</p>
            {health.daysInCurrentStage > 0 && health.status !== 'settled' && (
              <p className="text-xs text-muted-foreground mt-1.5">
                {t('claim_health_days_in_stage').replace(
                  '{days}',
                  String(health.daysInCurrentStage),
                )}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
