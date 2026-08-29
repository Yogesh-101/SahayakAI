'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClaim } from '@/contexts/ClaimContext';
import { getContinueRoute, type ClaimTabSlug } from '@/lib/claim-navigation';

export default function ClaimContinueButton() {
  const { claim, uan } = useClaim();
  const { t } = useLanguage();
  const pathname = usePathname();

  if (!claim) return null;

  const slug = (pathname.split('/').pop() ?? 'timeline') as ClaimTabSlug;
  const next = getContinueRoute(slug, claim, uan);
  if (!next) return null;

  return (
    <div className="flex justify-center pt-4">
      <Link href={next.href}>
        <Button
          variant="outline"
          className="gap-2 min-h-[44px] border-epfo-indigo/30 text-epfo-indigo hover:bg-epfo-indigo/5 btn-press"
        >
          {t(next.labelKey)}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
