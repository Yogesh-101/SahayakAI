'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scale } from 'lucide-react';
import RightsPanel from '@/components/RightsPanel';
import ClaimSection from '@/components/claim/ClaimSection';
import { useClaim } from '@/contexts/ClaimContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClaimRightsPage() {
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
      icon={Scale}
      title={t('section_rights_title')}
      subtitle={t('section_rights_subtitle')}
    >
      <RightsPanel claim={claim} />
    </ClaimSection>
  );
}
