'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import {
  IndianRupee,
  Calendar,
  FileText,
  Building2,
  User,
  Clock,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClaim } from '@/contexts/ClaimContext';
import {
  calculateClaimHealth,
  type HealthStatus,
} from '@/lib/services/claim-health-score';
import { useState } from 'react';

const CLAIM_TYPE_LABELS: Record<string, Record<string, string>> = {
  en: { withdrawal: 'PF Withdrawal' },
  hi: { withdrawal: 'PF निकासी' },
};

const STATUS_STYLES: Record<HealthStatus, { ring: string; fill: string; badge: string }> = {
  settled: { ring: 'stroke-green-500', fill: 'text-green-600', badge: 'bg-green-100 text-green-800 border-green-200' },
  excellent: { ring: 'stroke-green-500', fill: 'text-green-600', badge: 'bg-green-100 text-green-800 border-green-200' },
  good: { ring: 'stroke-blue-500', fill: 'text-blue-600', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
  warning: { ring: 'stroke-amber-500', fill: 'text-amber-600', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  critical: { ring: 'stroke-red-500', fill: 'text-red-600', badge: 'bg-red-100 text-red-800 border-red-200' },
};

function HealthRing({ score, status }: { score: number; status: HealthStatus }) {
  const styles = STATUS_STYLES[status];
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-14 h-14 shrink-0" title="Claim Health Score">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="5" className="text-gray-200" stroke="currentColor" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={styles.ring}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${styles.fill}`}>{score}</span>
      </div>
    </div>
  );
}

interface ClaimOverviewCardProps {
  compact?: boolean;
}

export default function ClaimOverviewCard({ compact = false }: ClaimOverviewCardProps) {
  const { claim, allCompleted } = useClaim();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);

  if (!claim) return null;

  const health = calculateClaimHealth(claim);
  const healthStyles = STATUS_STYLES[health.status];
  const currentStageStatus = claim.stages[claim.currentStage].status;
  const statusKey =
    currentStageStatus === 'blocked'
      ? 'status_blocked'
      : currentStageStatus === 'completed'
        ? 'status_completed'
        : currentStageStatus === 'in_progress'
          ? 'status_in_progress'
          : 'status_pending';
  const claimTypeLabels = CLAIM_TYPE_LABELS[language] || CLAIM_TYPE_LABELS.en;

  const shareStatus = async () => {
    const text = `My EPFO claim (UAN: ${claim.uan}) is at ${claim.currentStage} stage. Track yours at SahayakAI.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SahayakAI Claim Status', text });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: t('copied_title'), description: t('copied_status') });
    }
  };

  if (compact && !expanded) {
    return (
      <Card className="gov-card border-gray-200 overflow-hidden">
        <CardContent className="py-3">
          <div className="flex items-center gap-3">
            <HealthRing score={health.score} status={health.status} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-[#1a237e] truncate">{claim.memberName}</p>
              <p className="text-xs text-muted-foreground font-mono">UAN: {claim.uan}</p>
            </div>
            <Badge variant={currentStageStatus === 'blocked' ? 'destructive' : 'secondary'} className="text-xs shrink-0">
              {allCompleted ? t('status_settled') : t(statusKey)}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setExpanded(true)}
              aria-label={t('expand_details')}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gov-card border-gray-200 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#f8c8dc] via-[#c77dff] to-[#5e72e4]" />
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <HealthRing score={health.score} status={health.status} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <CardTitle className="text-xl sm:text-2xl text-[#1a237e]">
                  {claim.memberName}
                </CardTitle>
                <CardDescription className="font-mono">UAN: {claim.uan}</CardDescription>
              </div>
              <div className="flex items-center gap-2 self-start">
                <Badge variant="outline" className={`text-[10px] ${healthStyles.badge}`}>
                  {health.label}
                </Badge>
                <Badge
                  variant={currentStageStatus === 'blocked' ? 'destructive' : 'secondary'}
                  className="text-sm px-3 py-1"
                >
                  {allCompleted ? t('status_settled') : t(statusKey)}
                </Badge>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 btn-press"
                  onClick={shareStatus}
                  aria-label={t('share_status')}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                {compact && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setExpanded(false)}
                    aria-label={t('collapse_details')}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            {health.status !== 'settled' && (
              <p className="text-xs text-muted-foreground mt-2">{health.summary}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { icon: FileText, bg: 'bg-indigo-50', color: 'text-epfo-indigo', label: t('claim_type'), value: claimTypeLabels[claim.claimType] ?? 'PF Withdrawal' },
            { icon: IndianRupee, bg: 'bg-green-50', color: 'text-green-600', label: t('amount'), value: `₹${claim.amount.toLocaleString('en-IN')}` },
            { icon: Calendar, bg: 'bg-blue-50', color: 'text-blue-600', label: t('filed_on'), value: format(new Date(claim.filingDate), 'dd MMM yyyy') },
            { icon: Building2, bg: 'bg-purple-50', color: 'text-purple-600', label: t('employer'), value: claim.employerName },
          ].map(({ icon: Ic, bg, color, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Ic className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-muted-foreground text-[10px]">{label}</p>
                <p className="font-medium text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {claim.estimatedSettlement && !allCompleted && (
          <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800">
              {t('estimated_settlement')}{' '}
              <strong>{format(new Date(claim.estimatedSettlement), 'dd MMM yyyy')}</strong>
            </span>
          </div>
        )}

        {allCompleted && (
          <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm">
            <User className="w-4 h-4 text-green-600" />
            <span className="text-green-800">
              ₹{claim.amount.toLocaleString('en-IN')} <strong>{t('settled_message')}</strong>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
