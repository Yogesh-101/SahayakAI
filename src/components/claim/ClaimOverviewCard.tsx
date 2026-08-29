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

const CLAIM_TYPE_LABELS: Record<string, Record<string, string>> = {
  en: { withdrawal: 'PF Withdrawal' },
  hi: { withdrawal: 'PF निकासी' },
};

const STAGE_BADGE: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'warning' }
> = {
  completed: { label: 'Settled', variant: 'secondary' },
  in_progress: { label: 'In Progress', variant: 'default' },
  pending: { label: 'Pending', variant: 'default' },
  blocked: { label: 'Blocked', variant: 'destructive' },
};

export default function ClaimOverviewCard() {
  const { claim, allCompleted } = useClaim();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  if (!claim) return null;

  const currentStageStatus = claim.stages[claim.currentStage].status;
  const badge = STAGE_BADGE[currentStageStatus] ?? STAGE_BADGE.pending;
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
      toast({ title: 'Copied!', description: 'Status copied to clipboard.' });
    }
  };

  return (
    <Card className="gov-card border-gray-200 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#f8c8dc] via-[#c77dff] to-[#5e72e4]" />
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl sm:text-2xl text-[#1a237e]">
              {claim.memberName}
            </CardTitle>
            <CardDescription className="font-mono">UAN: {claim.uan}</CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Badge variant={badge.variant} className="text-sm px-3 py-1">
              {allCompleted ? t('status_settled') : badge.label}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 btn-press"
              onClick={shareStatus}
              aria-label="Share status"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            {
              icon: FileText,
              bg: 'bg-indigo-50',
              color: 'text-epfo-indigo',
              label: t('claim_type'),
              value: claimTypeLabels[claim.claimType] ?? 'PF Withdrawal',
            },
            {
              icon: IndianRupee,
              bg: 'bg-green-50',
              color: 'text-green-600',
              label: t('amount'),
              value: `₹${claim.amount.toLocaleString('en-IN')}`,
            },
            {
              icon: Calendar,
              bg: 'bg-blue-50',
              color: 'text-blue-600',
              label: t('filed_on'),
              value: format(new Date(claim.filingDate), 'dd MMM yyyy'),
            },
            {
              icon: Building2,
              bg: 'bg-purple-50',
              color: 'text-purple-600',
              label: t('employer'),
              value: claim.employerName,
            },
          ].map(({ icon: Ic, bg, color, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <div
                className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}
              >
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
              <strong>
                {format(new Date(claim.estimatedSettlement), 'dd MMM yyyy')}
              </strong>
            </span>
          </div>
        )}

        {allCompleted && (
          <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm">
            <User className="w-4 h-4 text-green-600" />
            <span className="text-green-800">
              ₹{claim.amount.toLocaleString('en-IN')}{' '}
              <strong>{t('settled_message')}</strong>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
