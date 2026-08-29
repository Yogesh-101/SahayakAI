'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ShieldCheck, HelpCircle, ExternalLink, Hash, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import VoiceInput from '@/components/VoiceInput';
import GovPageShell from '@/components/GovPageShell';
import ToolPageHeader from '@/components/ui/ToolPageHeader';
import GovInput from '@/components/ui/GovInput';
import DemoUanList from '@/components/ui/DemoUanList';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchClaimStatus } from '@/lib/adapters/epfo-adapter';
import {
  saveLastUan,
  isValidUan,
  DEMO_UAN_LENGTH,
  getLastUan,
} from '@/lib/claim-session';
import { PROBLEM_SCENARIOS } from '@/lib/claim-navigation';

export default function ClaimCheckPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [uan, setUan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUanHelp, setShowUanHelp] = useState(false);
  const [lastUan, setLastUan] = useState<string | null>(null);

  useEffect(() => {
    setLastUan(getLastUan());
  }, []);

  async function navigateToClaim(targetUan: string) {
    setError(null);
    setLoading(true);
    const trimmed = targetUan.trim();

    if (!isValidUan(trimmed)) {
      setError(t('check_uan_invalid'));
      setLoading(false);
      return;
    }

    try {
      await fetchClaimStatus(trimmed);
      saveLastUan(trimmed);
      toast({
        title: t('check_claim_found'),
        description: t('check_navigating'),
      });
      router.push(`/claim/${trimmed}/timeline`);
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
          <ToolPageHeader
            icon={Search}
            title={t('check_title')}
            description={t('check_subtitle')}
            accent="indigo"
          >
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-4 max-w-sm mx-auto">
              {t('check_no_real_epfo')}
            </p>
          </ToolPageHeader>

          {lastUan && (
            <button
              type="button"
              onClick={() => navigateToClaim(lastUan)}
              disabled={loading}
              className="mb-4 w-full flex items-center justify-between gap-3 rounded-xl border border-epfo-indigo/20 bg-epfo-indigo/5 px-4 py-3 text-left hover:bg-epfo-indigo/10 transition-colors disabled:opacity-60"
            >
              <div>
                <p className="text-xs font-medium text-epfo-indigo">{t('check_welcome_back')}</p>
                <p className="text-sm font-mono text-foreground mt-0.5">{lastUan}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-epfo-indigo shrink-0" />
            </button>
          )}

          <Card className="gov-card-elevated mb-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-[#1a237e]">{t('uan_label')}</CardTitle>
              <CardDescription>{t('check_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <GovInput
                    id="uan"
                    type="text"
                    inputMode="numeric"
                    maxLength={DEMO_UAN_LENGTH}
                    value={uan}
                    onChange={(e) => setUan(e.target.value.replace(/\D/g, '').slice(0, DEMO_UAN_LENGTH))}
                    placeholder={t('uan_placeholder')}
                    icon={Hash}
                    error={uan.length > 0 && !isValidUan(uan)}
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
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900">
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
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700" role="alert">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gov"
                  className="w-full"
                  size="lg"
                  disabled={loading || !isValidUan(uan)}
                >
                  {loading ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      {t('checking')}
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      {t('check_button')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <DemoUanList
            title={t('check_problem_picker_title')}
            disabled={loading}
            items={PROBLEM_SCENARIOS.map((demo) => ({
              uan: demo.uan,
              label: t(demo.labelKey),
              onClick: () => navigateToClaim(demo.uan),
            }))}
          />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/tools/kyc-check" className="flex items-center gap-1.5 hover:text-epfo-indigo min-h-[44px] px-2 rounded-lg hover:bg-epfo-indigo/5 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('nav_kyc_check')}
            </Link>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <Link href="/tools/escalate" className="flex items-center gap-1.5 hover:text-epfo-indigo min-h-[44px] px-2 rounded-lg hover:bg-epfo-indigo/5 transition-colors">
              {t('nav_escalate')}
            </Link>
          </div>
        </div>
      </div>
    </GovPageShell>
  );
}
