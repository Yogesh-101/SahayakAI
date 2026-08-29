'use client';

import { BarChart3 } from 'lucide-react';
import PeerComparison from '@/components/PeerComparison';
import FinancialImpact from '@/components/FinancialImpact';
import ClaimSection from '@/components/claim/ClaimSection';
import { useClaim } from '@/contexts/ClaimContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClaimAnalyticsPage() {
  const { claim, allCompleted } = useClaim();
  const { t } = useLanguage();

  if (!claim) return null;

  return (
    <ClaimSection
      icon={BarChart3}
      title={t('section_analytics_title')}
      subtitle={t('section_analytics_subtitle')}
    >
      <div className="grid md:grid-cols-1 gap-4">
        <PeerComparison claim={claim} />
        {!allCompleted && <FinancialImpact claim={claim} />}
      </div>
    </ClaimSection>
  );
}
