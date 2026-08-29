'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Wrench,
  BarChart3,
  Scale,
  MessageSquare,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClaim } from '@/contexts/ClaimContext';
import {
  CLAIM_JOURNEY,
  type ClaimTabSlug,
  isClaimSettled,
} from '@/lib/claim-navigation';

const STEP_META: Record<
  ClaimTabSlug,
  { icon: LucideIcon; labelKey: string; hiddenWhenSettled?: boolean }
> = {
  timeline: { icon: Search, labelKey: 'step_status' },
  diagnosis: { icon: Wrench, labelKey: 'step_fix', hiddenWhenSettled: true },
  analytics: { icon: BarChart3, labelKey: 'step_compare' },
  rights: { icon: Scale, labelKey: 'step_rights', hiddenWhenSettled: true },
  alerts: { icon: MessageSquare, labelKey: 'step_alerts' },
};

export default function ClaimStepper() {
  const { uan, allCompleted } = useClaim();
  const { t } = useLanguage();
  const pathname = usePathname();
  const base = `/claim/${uan}`;

  const steps = CLAIM_JOURNEY.filter(
    (slug) => !STEP_META[slug].hiddenWhenSettled || !allCompleted,
  );

  const currentSlug =
    steps.find((slug) => pathname.endsWith(`/${slug}`)) ?? 'timeline';
  const currentIndex = steps.indexOf(currentSlug);

  return (
    <nav
      className="overflow-x-auto scrollbar-hide -mx-1 px-1"
      aria-label={t('journey_stepper_label')}
    >
      <ol className="flex items-center gap-1 min-w-max py-1">
        {steps.map((slug, index) => {
          const meta = STEP_META[slug];
          const href = `${base}/${slug}`;
          const isActive = slug === currentSlug;
          const isDone = index < currentIndex;

          return (
            <li key={slug} className="flex items-center">
              {index > 0 && (
                <div
                  className={`w-4 sm:w-8 h-px mx-0.5 ${
                    isDone ? 'bg-epfo-indigo' : 'bg-gray-200'
                  }`}
                  aria-hidden
                />
              )}
              <Link
                href={href}
                className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-2 text-xs font-medium whitespace-nowrap min-h-[40px] transition-colors ${
                  isActive
                    ? 'bg-[#1a237e] text-white shadow-sm'
                    : isDone
                      ? 'bg-epfo-indigo/10 text-epfo-indigo'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <meta.icon className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="hidden xs:inline sm:inline">{t(meta.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
