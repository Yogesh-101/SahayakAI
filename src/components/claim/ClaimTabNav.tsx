'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Brain,
  BarChart3,
  Scale,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { useClaim } from '@/contexts/ClaimContext';

type TabDef = {
  slug: string;
  label: string;
  icon: LucideIcon;
  hiddenWhenSettled?: boolean;
};

const TABS: TabDef[] = [
  { slug: 'timeline', label: 'Timeline', icon: Search },
  { slug: 'diagnosis', label: 'Diagnosis', icon: Brain, hiddenWhenSettled: true },
  { slug: 'analytics', label: 'Analytics', icon: BarChart3 },
  { slug: 'rights', label: 'Rights', icon: Scale, hiddenWhenSettled: true },
  { slug: 'alerts', label: 'Alerts', icon: MessageSquare },
];

export default function ClaimTabNav() {
  const { uan, allCompleted } = useClaim();
  const pathname = usePathname();
  const base = `/claim/${uan}`;
  const visibleTabs = TABS.filter((tab) => !tab.hiddenWhenSettled || !allCompleted);

  return (
    <nav
      className="sticky top-[3.5rem] z-40 -mx-4 px-4 py-3 bg-white/95 backdrop-blur border-b border-gray-100"
      aria-label="Claim sections"
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center sm:justify-start max-w-3xl mx-auto">
        {visibleTabs.map((tab) => {
          const href = `${base}/${tab.slug}`;
          const isActive = pathname === href || pathname.endsWith(`/${tab.slug}`);
          return (
            <Link
              key={tab.slug}
              href={href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1a237e] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
