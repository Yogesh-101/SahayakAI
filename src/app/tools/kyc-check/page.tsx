'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import KYCHealthScore from '@/components/KYCHealthScore';
import GovPageShell from '@/components/GovPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { validateKYC, type KYCHealthResult } from '@/lib/services/kyc-validator';

export default function KYCCheckPage() {
  const { t } = useLanguage();
  const [uan, setUan] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KYCHealthResult | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!uan.trim()) {
      setError('Please enter your UAN');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    await new Promise(r => setTimeout(r, 1500));

    const kycResult = validateKYC(uan);
    if (!kycResult) {
      setError('UAN not found. Try demo UANs: 123456789, 987654321, 555555555');
      setLoading(false);
      return;
    }

    setResult(kycResult);
    setLoading(false);
  };

  return (
    <GovPageShell breadcrumbs={[{ label: t('nav_kyc_check') }]}>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a237e] mb-2">{t('tool_kyc_title')}</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {t('tool_kyc_desc')}
          </p>
        </div>

        {/* Input Card */}
        <Card className="gov-card border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#1a237e]">{t('uan_label')}</CardTitle>
            <CardDescription>
              We will cross-check your name, DOB, and documents across EPFO, PAN, and Aadhaar records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <input
                type="text"
                value={uan}
                onChange={(e) => setUan(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                placeholder={t('uan_placeholder')}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-epfo-indigo/50 focus:border-epfo-indigo transition-colors"
                disabled={loading}
              />
              <Button onClick={handleCheck} disabled={loading} className="gap-2 bg-epfo-indigo hover:bg-epfo-navy text-white btn-press px-6">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? 'Checking...' : 'Check KYC'}
              </Button>
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

            {/* Demo UANs */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">{t('demo_uans')}</p>
              {[
                { uan: '123456789', label: 'Name mismatch + No Date of Exit' },
                { uan: '987654321', label: 'PAN name + DOB mismatch' },
                { uan: '555555555', label: 'All clear' },
              ].map(demo => (
                <button
                  key={demo.uan}
                  onClick={() => setUan(demo.uan)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 hover:border-epfo-indigo hover:shadow-sm transition-all group text-left"
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

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-epfo-indigo mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Cross-checking across EPFO, PAN, and Aadhaar...</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <KYCHealthScore result={result} />
            <div className="flex gap-3 justify-center pt-4">
              {result.status === 'green' ? (
                <Link href="/claim/check">
                  <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700 text-white btn-press">
                    <ShieldCheck className="w-4 h-4" />
                    Proceed to File Claim
                  </Button>
                </Link>
              ) : (
                <Link href="/claim/check">
                  <Button size="lg" variant="outline" className="btn-press">
                    File Anyway (Not Recommended)
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </GovPageShell>
  );
}
