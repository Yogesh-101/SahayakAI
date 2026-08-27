'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  IndianRupee,
  Calendar,
  FileText,
  Building2,
  User,
  Clock,
  Share2,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import ClaimStatusTimeline from '@/components/ClaimStatusTimeline';
import DiagnosisPanel from '@/components/DiagnosisPanel';
import WhatsAppPreview from '@/components/WhatsAppPreview';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchClaimStatus } from '@/lib/adapters/epfo-adapter';
import type { ClaimStatus } from '@/types/claim';

const CLAIM_TYPE_LABELS: Record<string, Record<string, string>> = {
  en: { withdrawal: 'PF Withdrawal', loan: 'PF Loan', pension: 'Pension' },
  hi: { withdrawal: 'PF निकासी', loan: 'PF ऋण', pension: 'पेंशन' },
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

export default function ClaimDetailPage() {
  const params = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [claim, setClaim] = useState<ClaimStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchClaimStatus(params.id);
        if (!cancelled) setClaim(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : 'Failed to load claim',
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const shareStatus = async () => {
    const text = claim
      ? `My EPFO claim (UAN: ${claim.uan}) is at ${claim.currentStage} stage. Track yours at SahayakAI.`
      : '';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SahayakAI Claim Status', text });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied!', description: 'Status copied to clipboard.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <div className="text-center space-y-3">
          <Spinner className="mx-auto h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Fetching claim status...
          </p>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <header className="container mx-auto px-4 py-6">
          <Link
            href="/claim/check"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('check_another_claim')}
          </Link>
        </header>
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-danger-500" />
              </div>
              <p className="font-medium text-lg">{t('error_claim_not_found')}</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Link href="/claim/check">
                <Button>{t('error_try_another_uan')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentStageStatus = claim.stages[claim.currentStage].status;
  const badge = STAGE_BADGE[currentStageStatus] ?? STAGE_BADGE.pending;
  const allCompleted = Object.values(claim.stages).every(
    (s) => s.status === 'completed',
  );
  const claimTypeLabels = CLAIM_TYPE_LABELS[language] || CLAIM_TYPE_LABELS.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link
          href="/claim/check"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('check_another_claim')}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <div className="text-lg font-bold text-primary">{t('app_name')}</div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-xl sm:text-2xl">
                  {claim.memberName}
                </CardTitle>
                <CardDescription>UAN: {claim.uan}</CardDescription>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Badge
                  variant={badge.variant}
                  className="text-sm px-3 py-1"
                >
                  {allCompleted ? t('status_settled') : badge.label}
                </Badge>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={shareStatus} aria-label="Share status">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">{t('claim_type')}</p>
                  <p className="font-medium">
                    {claimTypeLabels[claim.claimType]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <IndianRupee className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">{t('amount')}</p>
                  <p className="font-medium">
                    ₹{claim.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">{t('filed_on')}</p>
                  <p className="font-medium">
                    {format(new Date(claim.filingDate), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">{t('employer')}</p>
                  <p className="font-medium">{claim.employerName}</p>
                </div>
              </div>
            </div>

            {claim.estimatedSettlement && !allCompleted && (
              <div className="mt-4 flex items-center gap-2 bg-secondary-50 border border-secondary-200 rounded-md px-3 py-2 text-sm">
                <Clock className="w-4 h-4 text-secondary-600" />
                <span className="text-secondary-800">
                  {t('estimated_settlement')}{' '}
                  <strong>
                    {format(new Date(claim.estimatedSettlement), 'dd MMM yyyy')}
                  </strong>
                </span>
              </div>
            )}

            {allCompleted && (
              <div className="mt-4 flex items-center gap-2 bg-secondary-50 border border-secondary-200 rounded-md px-3 py-2 text-sm">
                <User className="w-4 h-4 text-secondary-600" />
                <span className="text-secondary-800">
                  ₹{claim.amount.toLocaleString('en-IN')}{' '}
                  <strong>{t('settled_message')}</strong>
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('claim_progress')}</CardTitle>
            <CardDescription>
              {t('claim_progress_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClaimStatusTimeline
              stages={claim.stages}
              currentStage={claim.currentStage}
            />
          </CardContent>
        </Card>

        {!allCompleted && <DiagnosisPanel claim={claim} />}

        <WhatsAppPreview claim={claim} />

        <p className="text-center text-xs text-muted-foreground">
          {t('disclaimer')}
        </p>
      </main>
    </div>
  );
}
