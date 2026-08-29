'use client';

import { Scale, ExternalLink, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ClaimStatus } from '@/types/claim';
import { getRightsForClaim } from '@/lib/services/rights-engine';
import { isClaimBlocked } from '@/lib/claim-navigation';

interface RightsPanelProps {
  claim: ClaimStatus;
}

export default function RightsPanel({ claim }: RightsPanelProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const rights = getRightsForClaim(claim);
  const topRight = rights[0];
  const restRights = rights.slice(1);
  const displayRights = expanded ? restRights : restRights.slice(0, 2);

  return (
    <div className="space-y-4">
      {topRight && isClaimBlocked(claim) && (
        <Card className="border-2 border-indigo-400 bg-indigo-50/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-indigo-900">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              {t('rights_priority')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold text-base text-indigo-900">{topRight.title}</p>
            <p className="text-sm text-gray-700">{topRight.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[10px]">{topRight.legalBasis}</Badge>
              {topRight.actionUrl && (
                <a
                  href={topRight.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium min-h-[44px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  {topRight.actionLabel}
                </a>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              {t('rights_applies')} {topRight.applicableWhen}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-indigo-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
            <Scale className="w-4 h-4 text-indigo-600" />
            {t('rights_title')}
            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs">
              {t('rights_count').replace('{count}', String(rights.length))}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(isClaimBlocked(claim) ? displayRights : (expanded ? rights : rights.slice(0, 3))).map(
            (right, i) => (
              <div
                key={i}
                className="rounded-lg border p-3 bg-indigo-50/30 hover:bg-indigo-50 transition-colors"
              >
                <p className="font-medium text-sm text-indigo-900 mb-1">{right.title}</p>
                <p className="text-xs text-gray-700 mb-2">{right.description}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {right.legalBasis}
                  </Badge>
                  {right.actionUrl && (
                    <a
                      href={right.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium min-h-[44px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {right.actionLabel}
                    </a>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 italic">
                  {t('rights_applies')} {right.applicableWhen}
                </p>
              </div>
            ),
          )}

          {rights.length > 3 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-1 text-sm text-primary hover:underline py-3 min-h-[44px]"
            >
              {expanded ? (
                <>{t('rights_show_less')} <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>{t('rights_show_more').replace('{count}', String(rights.length - 3))} <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}

          <p className="text-[10px] text-muted-foreground text-center pt-2 border-t">
            {t('rights_disclaimer')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
