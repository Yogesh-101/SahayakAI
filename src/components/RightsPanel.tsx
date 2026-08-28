'use client';

import { Scale, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ClaimStatus } from '@/types/claim';
import { getRightsForClaim } from '@/lib/services/rights-engine';

interface RightsPanelProps {
  claim: ClaimStatus;
}

export default function RightsPanel({ claim }: RightsPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const rights = getRightsForClaim(claim);
  const displayRights = expanded ? rights : rights.slice(0, 3);

  return (
    <Card className="border-indigo-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Scale className="w-4 h-4 text-indigo-600" />
          Know Your Rights
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs">
            {rights.length} rights applicable
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayRights.map((right, i) => (
          <div key={i} className="rounded-lg border p-3 bg-indigo-50/30 hover:bg-indigo-50 transition-colors">
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
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  {right.actionLabel}
                </a>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 italic">
              Applies because: {right.applicableWhen}
            </p>
          </div>
        ))}

        {rights.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 text-sm text-primary hover:underline py-2"
          >
            {expanded ? (
              <>Show Less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Show {rights.length - 3} More Rights <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}

        <p className="text-[10px] text-muted-foreground text-center pt-2 border-t">
          Rights are contextual based on your claim stage and delay duration.
          This is informational guidance, not legal advice.
        </p>
      </CardContent>
    </Card>
  );
}
