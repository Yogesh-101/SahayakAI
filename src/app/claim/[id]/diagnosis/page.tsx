'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';
import DiagnosisPanel from '@/components/DiagnosisPanel';
import EmailTracker from '@/components/EmailTracker';
import ClaimSection from '@/components/claim/ClaimSection';
import { useClaim } from '@/contexts/ClaimContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClaimDiagnosisPage() {
  const { claim, allCompleted } = useClaim();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (allCompleted) {
      router.replace(`/claim/${claim?.uan}/timeline`);
    }
  }, [allCompleted, claim?.uan, router]);

  if (!claim || allCompleted) return null;

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
