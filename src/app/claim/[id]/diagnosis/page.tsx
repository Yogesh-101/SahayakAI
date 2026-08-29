'use client';

import { useEffect } from 'react';
import { Brain } from 'lucide-react';
import DiagnosisPanel from '@/components/DiagnosisPanel';
import EmailTracker from '@/components/EmailTracker';
import ClaimSection from '@/components/claim/ClaimSection';
import SettledTabNotice from '@/components/claim/SettledTabNotice';
import { useClaim } from '@/contexts/ClaimContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClaimDiagnosisPage() {
  const { claim, allCompleted } = useClaim();
  const { t } = useLanguage();

  if (!claim) return null;

  if (allCompleted) {
    return (
      <ClaimSection
        icon={Brain}
        title={t('section_diagnosis_title')}
        subtitle={t('section_diagnosis_subtitle')}
      >
        <SettledTabNotice uan={claim.uan} />
      </ClaimSection>
    );
  }

  return (
    <ClaimSection
      icon={Brain}
      title={t('section_diagnosis_title')}
      subtitle={t('section_diagnosis_subtitle')}
    >
      <div className="space-y-4">
        <DiagnosisPanel claim={claim} />
        {claim.currentStage === 'employerApproval' && (
          <EmailTracker claim={claim} />
        )}
      </div>
    </ClaimSection>
  );
}
