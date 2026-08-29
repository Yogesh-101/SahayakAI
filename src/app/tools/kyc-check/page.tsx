'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, Loader2, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import KYCHealthScore from '@/components/KYCHealthScore';
import GovPageShell from '@/components/GovPageShell';
import ToolPageHeader from '@/components/ui/ToolPageHeader';
import GovInput from '@/components/ui/GovInput';
import DemoUanList from '@/components/ui/DemoUanList';
import PageLoading from '@/components/ui/PageLoading';
import { useLanguage } from '@/contexts/LanguageContext';
import { validateKYC, type KYCHealthResult } from '@/lib/services/kyc-validator';
import {
  DEMO_UAN_EMPLOYER,
  DEMO_UAN_KYC,
  DEMO_UAN_PROCESSING,
  DEMO_UAN_LENGTH,
  isValidUan,
  formatDemoUanList,
} from '@/lib/claim-session';

export default function KYCCheckPage() {
  const { t } = useLanguage();
  const [uan, setUan] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KYCHealthResult | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!uan.trim()) {
      setError(t('kyc_enter_uan'));
      return;
    }
    if (!isValidUan(uan.trim())) {
      setError(t('check_uan_invalid'));
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    await new Promise(r => setTimeout(r, 1500));

    const kycResult = validateKYC(uan);
    if (!kycResult) {
      setError(`${t('kyc_not_found')} ${t('error_sample_uans')}: ${formatDemoUanList()}`);
      setLoading(false);
      return;
    }

    setResult(kycResult);
    setLoading(false);
  };

  return (
    <GovPageShell breadcrumbs={[{ label: t('nav_kyc_check') }]}>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <ToolPageHeader
          icon={ShieldCheck}
          title={t('tool_kyc_title')}
          description={t('tool_kyc_desc')}
          accent="green"
        />

        <Card className="gov-card-elevated mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#1a237e]">{t('uan_label')}</CardTitle>
            <CardDescription>{t('kyc_check_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <GovInput
                type="text"
                inputMode="numeric"
                maxLength={DEMO_UAN_LENGTH}
                value={uan}
                onChange={(e) => setUan(e.target.value.replace(/\D/g, '').slice(0, DEMO_UAN_LENGTH))}
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                placeholder={t('uan_placeholder')}
                icon={Hash}
                error={!!error || (uan.length > 0 && !isValidUan(uan))}
                disabled={loading}
              />
              <Button
                variant="gov"
                onClick={handleCheck}
                disabled={loading || (uan.length > 0 && !isValidUan(uan))}
                className="shrink-0 px-6"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? t('kyc_checking') : t('kyc_check_button')}
              </Button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <DemoUanList
              title={t('demo_uans')}
              disabled={loading}
              items={[
                { uan: DEMO_UAN_EMPLOYER, label: t('kyc_scenario_employer'), onClick: () => setUan(DEMO_UAN_EMPLOYER) },
                { uan: DEMO_UAN_KYC, label: t('kyc_scenario_kyc'), onClick: () => setUan(DEMO_UAN_KYC) },
                { uan: DEMO_UAN_PROCESSING, label: t('kyc_scenario_processing'), onClick: () => setUan(DEMO_UAN_PROCESSING) },
              ]}
            />
          </CardContent>
        </Card>

        {loading && <PageLoading message={t('kyc_loading')} />}

        {result && (
          <div className="space-y-6">
            <KYCHealthScore result={result} />
            <div className="flex gap-3 justify-center pt-4">
              {result.status === 'green' ? (
                <Link href="/claim/check">
                  <Button size="lg" variant="gov" className="bg-green-600 hover:bg-green-700 shadow-green-600/25">
                    <ShieldCheck className="w-4 h-4" />
                    {t('kyc_proceed')}
                  </Button>
                </Link>
              ) : (
                <Link href="/claim/check">
                  <Button size="lg" variant="outline">
                    {t('kyc_file_anyway')}
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
