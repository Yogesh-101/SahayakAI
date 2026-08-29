'use client';

import { MessageSquare } from 'lucide-react';
import WhatsAppPreview from '@/components/WhatsAppPreview';
import ClaimSection from '@/components/claim/ClaimSection';
import { useClaim } from '@/contexts/ClaimContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClaimAlertsPage() {
  const { claim } = useClaim();
  const { t } = useLanguage();

  if (!claim) return null;

  return (
    <ClaimSection
      icon={MessageSquare}
      title={t('whatsapp_title')}
      subtitle={t('whatsapp_subtitle')}
    >
      <WhatsAppPreview claim={claim} hideHeader />
    </ClaimSection>
  );
}
