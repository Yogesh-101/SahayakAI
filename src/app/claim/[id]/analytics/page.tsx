'use client';

import { BarChart3 } from 'lucide-react';
import PeerComparison from '@/components/PeerComparison';
import FinancialImpact from '@/components/FinancialImpact';
import ClaimSection from '@/components/claim/ClaimSection';
import { useClaim } from '@/contexts/ClaimContext';

export default function ClaimAnalyticsPage() {
  const { claim, allCompleted } = useClaim();

  if (!claim) return null;

  return (
    <ClaimSection
      icon={BarChart3}
      title="Analytics & Financial Insights"
      subtitle="Compare your claim and understand the cost of delay"
    >
      <div className="grid md:grid-cols-1 gap-4">
        <PeerComparison claim={claim} />
        {!allCompleted && <FinancialImpact claim={claim} />}
      </div>
    </ClaimSection>
  );
}
