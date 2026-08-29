'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Wrench,
  BarChart3,
  Scale,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { useClaim } from '@/contexts/ClaimContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTabBadges, type ClaimTabSlug } from '@/lib/claim-navigation';

const TABS: Array<{
  slug: ClaimTabSlug;
  labelKey: string;
  icon: LucideIcon;
  hiddenWhenSettled?: boolean;
}> = [
  { slug: 'timeline', labelKey: 'tab_status', icon: Search },
  { slug: 'diagnosis', labelKey: 'tab_fix', icon: Wrench, hiddenWhenSettled: true },
  { slug: 'analytics', labelKey: 'tab_compare', icon: BarChart3 },
  { slug: 'rights', labelKey: 'tab_rights', icon: Scale, hiddenWhenSettled: true },
  { slug: 'alerts', labelKey: 'tab_alerts', icon: MessageSquare },
];

export default function ClaimBottomNav() {
  const { uan, allCompleted, claim } = useClaim();
  const { t } = useLanguage();
  const pathname = usePathname();
  const base = `/claim/${uan}`;
  const visibleTabs = TABS.filter((tab) => !tab.hiddenWhenSettled || !allCompleted);
  const badges = claim ? getTabBadges(claim) : {};

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 safe-area-pb"
      aria-label={t('claim_tabs_label')}
    >
      <div className="flex justify-around items-stretch max-w-lg mx-auto">
        {visibleTabs.map((tab) => {
          const href = `${base}/${tab.slug}`;
          const isActive = pathname.endsWith(`/${tab.slug}`);
          const badge = badges[tab.slug];

          return (
            <Link
              key={tab.slug}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 min-h-[56px] text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#1a237e]' : 'text-gray-500'
              }`}
            >
              <span className="relative">
                <tab.icon className={`w-5 h-5 ${isActive ? 'text-[#1a237e]' : ''}`} />
                {badge && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-bold bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {badge.length > 1 ? '!' : badge}
                  </span>
                )}
              </span>
              <span>{t(tab.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
