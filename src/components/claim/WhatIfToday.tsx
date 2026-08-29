'use client';

import { Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ClaimStatus } from '@/types/claim';
import { calculateClaimHealth } from '@/lib/services/claim-health-score';

interface WhatIfTodayProps {
  claim: ClaimStatus;
}

export default function WhatIfToday({ claim }: WhatIfTodayProps) {
  const { t } = useLanguage();
  const health = calculateClaimHealth(claim);
  const daysSaved = Math.max(3, 14 - health.daysInCurrentStage);
  const estimatedDays = Math.max(2, daysSaved);

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-green-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-900">
              {t('what_if_today_title')}
            </p>
            <p className="text-xs text-green-800 mt-1">
              {t('what_if_today_desc').replace('{days}', String(estimatedDays))}
            </p>
            <p className="text-[10px] text-green-700 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t('what_if_today_note')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
