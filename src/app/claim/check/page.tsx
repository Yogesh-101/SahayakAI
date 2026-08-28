'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
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
import GovPageShell from '@/components/GovPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchClaimStatus } from '@/lib/adapters/epfo-adapter';

export default function ClaimCheckPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [uan, setUan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await fetchClaimStatus(uan);
      toast({ title: 'Claim found!', description: `Navigating to claim ${uan}...` });
      router.push(`/claim/${uan}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const DEMO_CLAIMS = [
    { uan: '123456789', label: 'Employer block', status: 'blocked' },
    { uan: '987654321', label: 'KYC mismatch', status: 'blocked' },
    { uan: '555555555', label: 'Processing', status: 'active' },
    { uan: '111111111', label: 'Settled', status: 'settled' },
  ];

  return (
    <GovPageShell
      breadcrumbs={[{ label: t('cta_check_status') }]}
    >
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-lg mx-auto">
          {/* Page title */}
          <div className="text-center mb-8 fade-in-section visible">
            <div className="w-14 h-14 rounded-full bg-epfo-indigo/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-epfo-indigo" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a237e] mb-2">
              {t('check_title')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t('check_subtitle')}
            </p>
          </div>

          {/* Search Card */}
          <Card className="gov-card border-gray-200 shadow-sm mb-6">
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
                    value={uan}
                    onChange={(e) => setUan(e.target.value)}
                    placeholder={t('uan_placeholder')}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-epfo-indigo/50 focus-visible:border-epfo-indigo transition-colors"
                    disabled={loading}
                    required
                    autoComplete="off"
                  />
                  <VoiceInput onTranscript={(text) => setUan(text)} />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700" role="alert">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-epfo-indigo hover:bg-epfo-navy text-white py-6 text-base btn-press"
                  size="lg"
                  disabled={loading || !uan.trim()}
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

          {/* Demo UANs */}
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-5">
              <p className="text-xs font-semibold text-amber-800 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-[10px] font-bold">?</span>
                {t('demo_uans')}
              </p>
              <div className="space-y-2">
                {DEMO_CLAIMS.map((demo) => (
                  <button
                    key={demo.uan}
                    type="button"
                    onClick={() => setUan(demo.uan)}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-white rounded-lg border border-amber-200 hover:border-epfo-indigo hover:shadow-sm transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-medium text-sm text-[#1a237e]">{demo.uan}</span>
                      <span className="text-xs text-muted-foreground">{demo.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick links */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/tools/kyc-check" className="flex items-center gap-1 hover:text-epfo-indigo transition-colors">
              <ShieldCheck className="w-3 h-3" /> {t('nav_kyc_check')}
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/tools/escalate" className="flex items-center gap-1 hover:text-epfo-indigo transition-colors">
              {t('nav_escalate')}
            </Link>
          </div>
        </div>
      </div>
    </GovPageShell>
  );
}
