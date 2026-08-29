'use client';

import { Scale } from 'lucide-react';
import RightsPanel from '@/components/RightsPanel';
import ClaimSection from '@/components/claim/ClaimSection';
import SettledTabNotice from '@/components/claim/SettledTabNotice';
import { useClaim } from '@/contexts/ClaimContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClaimRightsPage() {
  const { claim, allCompleted } = useClaim();
  const { t } = useLanguage();

  if (!claim) return null;

  if (allCompleted) {
    return (
      <ClaimSection
        icon={Scale}
        title={t('section_rights_title')}
        subtitle={t('section_rights_subtitle')}
      >
        <SettledTabNotice uan={claim.uan} />
      </ClaimSection>
    );
  }

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
