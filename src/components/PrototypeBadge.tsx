'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface PrototypeBadgeProps {
  className?: string;
}

export default function PrototypeBadge({ className = '' }: PrototypeBadgeProps) {
  const { t } = useLanguage();

  return (
    <span
      className={`inline-flex items-center rounded-full border border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-800 ${className}`}
      title={t('prototype_badge_tooltip')}
    >
      {t('prototype_badge')}
    </span>
  );
}
