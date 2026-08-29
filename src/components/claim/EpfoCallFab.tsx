'use client';

import { Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClaim } from '@/contexts/ClaimContext';
import { isClaimBlocked } from '@/lib/claim-navigation';

export default function EpfoCallFab() {
  const { claim } = useClaim();
  const { t } = useLanguage();

  if (!claim || !isClaimBlocked(claim)) return null;

  return (
    <a
      href="tel:14470"
      className="md:hidden fixed bottom-[4.5rem] right-4 z-50 flex items-center gap-2 rounded-full bg-green-600 text-white shadow-lg px-4 py-3 min-h-[44px] text-sm font-semibold btn-press"
      aria-label={t('call_epfo_fab')}
    >
      <Phone className="w-4 h-4" />
      {t('call_epfo_short')}
    </a>
  );
}
