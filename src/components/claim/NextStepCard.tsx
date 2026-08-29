'use client';

import Link from 'next/link';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClaim } from '@/contexts/ClaimContext';
import { getNextStepInfo } from '@/lib/claim-navigation';

export default function NextStepCard() {
  const { claim, uan } = useClaim();
  const { t } = useLanguage();

  if (!claim) return null;

  const next = getNextStepInfo(claim, uan, t);
  if (!next) return null;

  return (
    <Card
      className={`gov-card overflow-hidden ${
        next.urgent ? 'border-red-200 bg-red-50/40' : 'border-blue-200 bg-blue-50/30'
      }`}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                next.urgent ? 'bg-red-100' : 'bg-blue-100'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${next.urgent ? 'text-red-600' : 'text-blue-600'}`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                {t('next_step_label')}
              </p>
              <p className="font-semibold text-sm text-[#1a237e]">{next.title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {next.description}
              </p>
            </div>
          </div>
          <Link href={next.href} className="shrink-0 w-full sm:w-auto">
            <Button
              className={`w-full sm:w-auto gap-2 min-h-[44px] btn-press ${
                next.urgent
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-epfo-indigo hover:bg-epfo-navy text-white'
              }`}
            >
              {next.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
