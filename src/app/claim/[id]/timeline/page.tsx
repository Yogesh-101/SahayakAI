'use client';

import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ClaimStatusTimeline from '@/components/ClaimStatusTimeline';
import ClaimSection from '@/components/claim/ClaimSection';
import { useClaim } from '@/contexts/ClaimContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClaimTimelinePage() {
  const { claim } = useClaim();
  const { t } = useLanguage();

  if (!claim) return null;

  return (
    <ClaimSection
      icon={Search}
      title={t('claim_progress')}
      subtitle={t('claim_progress_subtitle')}
    >
      <Card className="gov-card border-gray-200">
        <CardContent className="pt-6 pb-6">
          <ClaimStatusTimeline
            stages={claim.stages}
            currentStage={claim.currentStage}
          />
        </CardContent>
      </Card>
    </ClaimSection>
  );
}
