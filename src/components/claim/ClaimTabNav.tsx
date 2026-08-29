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

type TabDef = {
  slug: ClaimTabSlug;
  labelKey: string;
  icon: LucideIcon;
  hiddenWhenSettled?: boolean;
};

const TABS: TabDef[] = [
  { slug: 'timeline', labelKey: 'tab_status', icon: Search },
  { slug: 'diagnosis', labelKey: 'tab_fix', icon: Wrench, hiddenWhenSettled: true },
  { slug: 'analytics', labelKey: 'tab_compare', icon: BarChart3 },
  { slug: 'rights', labelKey: 'tab_rights', icon: Scale, hiddenWhenSettled: true },
  { slug: 'alerts', labelKey: 'tab_alerts', icon: MessageSquare },
];

export default function ClaimTabNav() {
  const { uan, allCompleted, claim } = useClaim();
  const { t } = useLanguage();
  const pathname = usePathname();
  const base = `/claim/${uan}`;
  const visibleTabs = TABS.filter((tab) => !tab.hiddenWhenSettled || !allCompleted);
  const badges = claim ? getTabBadges(claim) : {};

  return (
    <nav
      className="sticky top-14 z-40 -mx-4 px-4 py-2.5 bg-white/95 backdrop-blur border-b border-slate-100 hidden md:block"
      aria-label={t('claim_tabs_label')}
    >
      <div className="claim-nav-bar max-w-3xl mx-auto">
        {visibleTabs.map((tab) => {
          const href = `${base}/${tab.slug}`;
          const isActive = pathname === href || pathname.endsWith(`/${tab.slug}`);

          return (
            <ClaimNavTab
              key={tab.slug}
              href={href}
              label={t(tab.labelKey)}
              icon={tab.icon}
              isActive={isActive}
              showDot={!!badges[tab.slug]}
            />
          );
        })}
      </div>
    </nav>
  );
}
