'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ShieldCheck, ArrowRight, HelpCircle, ExternalLink } from 'lucide-react';
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
import VoiceInput from '@/components/VoiceInput';
import PrototypeBadge from '@/components/PrototypeBadge';
import GovPageShell from '@/components/GovPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchClaimStatus } from '@/lib/adapters/epfo-adapter';
import {
  saveLastUan,
  isValidUan,
  DEMO_UAN_LENGTH,
} from '@/lib/claim-session';
import { getDefaultTab } from '@/lib/claim-navigation';

const DEMO_CLAIMS = [
  { uan: '123456789', labelKey: 'problem_employer', tab: 'diagnosis' as const },
  { uan: '987654321', labelKey: 'problem_kyc', tab: 'diagnosis' as const },
  { uan: '555555555', labelKey: 'problem_processing', tab: 'timeline' as const },
  { uan: '111111111', labelKey: 'problem_payment', tab: 'alerts' as const },
];

export default function ClaimCheckPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [uan, setUan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUanHelp, setShowUanHelp] = useState(false);

  async function navigateToClaim(targetUan: string, tab?: string) {
    setError(null);
    setLoading(true);
    const trimmed = targetUan.trim();

    if (!isValidUan(trimmed)) {
      setError(t('check_uan_invalid'));
      setLoading(false);
      return;
    }

    try {
      const claim = await fetchClaimStatus(trimmed);
      saveLastUan(trimmed);
      const destination = tab ?? getDefaultTab(claim);
      toast({
        title: t('check_claim_found'),
        description: t('check_navigating'),
      });
      router.push(`/claim/${trimmed}/${destination}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('error_try_again');
      setError(msg);
      toast({ title: t('error_claim_not_found'), description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await navigateToClaim(uan);
  }

  return (
    <GovPageShell breadcrumbs={[{ label: t('cta_check_status') }]}>
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-center mb-4">
            <PrototypeBadge />
          </div>

          <div className="text-center mb-6 fade-in-section visible">
            <div className="w-14 h-14 rounded-full bg-epfo-indigo/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-epfo-indigo" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a237e] mb-2">
              {t('check_title')}
            </h1>
            <p className="text-muted-foreground text-sm">{t('check_subtitle')}</p>
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
              {t('check_no_real_epfo')}
            </p>
          </div>

          <Card className="gov-card border-gray-200 shadow-sm mb-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-[#1a237e]">{t('uan_label')}</CardTitle>
              <CardDescription>{t('check_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    id="uan"
                    type="text"
                    inputMode="numeric"
                    maxLength={DEMO_UAN_LENGTH}
                    value={uan}
                    onChange={(e) => setUan(e.target.value.replace(/\D/g, '').slice(0, DEMO_UAN_LENGTH))}
                    placeholder={t('uan_placeholder')}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-epfo-indigo/50 focus-visible:border-epfo-indigo"
                    disabled={loading}
                    required
                    autoComplete="off"
                    aria-invalid={uan.length > 0 && !isValidUan(uan)}
                  />
                  <VoiceInput onTranscript={(text) => setUan(text.replace(/\D/g, '').slice(0, DEMO_UAN_LENGTH))} />
                </div>

                {uan.length > 0 && !isValidUan(uan) && (
                  <p className="text-xs text-amber-700" role="status">
                    {t('check_uan_invalid')}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowUanHelp(!showUanHelp)}
                  className="flex items-center gap-1.5 text-xs text-epfo-indigo hover:underline min-h-[44px]"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {t('check_uan_help')}
                </button>

                {showUanHelp && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900">
                    <p>{t('check_uan_help_desc')}</p>
                    <a
                      href="https://unifiedportal-mem.epfindia.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-epfo-indigo font-medium hover:underline"
                    >
                      EPFO Member Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700" role="alert">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-epfo-indigo hover:bg-epfo-navy text-white py-6 text-base btn-press min-h-[48px]"
                  size="lg"
                  disabled={loading || !isValidUan(uan)}
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      {t('checking')}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {t('check_button')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-5">
              <div className="text-xs font-semibold text-amber-800 mb-3 flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] bg-amber-100 border-amber-300">
                  {t('demo_uans')}
                </Badge>
              </div>
              <div className="space-y-2">
                {DEMO_CLAIMS.map((demo) => (
                  <button
                    key={demo.uan}
                    type="button"
                    disabled={loading}
                    onClick={() => navigateToClaim(demo.uan, demo.tab)}
                    className="w-full flex items-center justify-between px-3 py-3 bg-white rounded-lg border border-amber-200 hover:border-epfo-indigo hover:shadow-sm transition-all group text-left min-h-[48px]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-medium text-sm text-[#1a237e]">{demo.uan}</span>
                      <span className="text-xs text-muted-foreground">{t(demo.labelKey)}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-epfo-indigo" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/tools/kyc-check" className="flex items-center gap-1 hover:text-epfo-indigo min-h-[44px]">
              <ShieldCheck className="w-3 h-3" /> {t('nav_kyc_check')}
            </Link>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <Link href="/tools/escalate" className="flex items-center gap-1 hover:text-epfo-indigo min-h-[44px]">
              {t('nav_escalate')}
            </Link>
          </div>
        </div>
      </div>
    </GovPageShell>
  );
}
