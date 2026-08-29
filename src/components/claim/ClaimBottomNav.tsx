'use client';

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
import ClaimNavTab from '@/components/claim/ClaimNavTab';

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
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-slate-200 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label={t('claim_tabs_label')}
    >
      <div className="flex justify-around items-stretch max-w-lg mx-auto">
        {visibleTabs.map((tab) => {
          const href = `${base}/${tab.slug}`;
          const isActive = pathname.endsWith(`/${tab.slug}`);

          return (
            <ClaimNavTab
              key={tab.slug}
              href={href}
              label={t(tab.labelKey)}
              icon={tab.icon}
              isActive={isActive}
              showDot={!!badges[tab.slug]}
              layout="vertical"
            />
          );
        })}
      </div>
    </nav>
  );
}
