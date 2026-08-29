'use client';

import { BarChart3, TrendingUp, Building2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ClaimStatus } from '@/types/claim';
import { differenceInDays } from 'date-fns';

interface PeerComparisonProps {
  claim: ClaimStatus;
}

interface PeerData {
  averageDays: number;
  percentileFaster: number;
  employerAverage: number;
  employerRank: string;
  regionSpeed: 'fast' | 'normal' | 'slow';
  regionName: string;
  stageAverage: Record<string, number>;
  totalClaims: number;
}

function getMockPeerData(claim: ClaimStatus): PeerData {
  const daysInProcess = differenceInDays(new Date(), claim.filingDate);

  const sectorAverages: Record<string, number> = {
    'TechVista Solutions Pvt Ltd': 12,
    'BrightSteel Manufacturing': 18,
    'Cloudbridge IT Services': 8,
    'National Textiles Ltd': 14,
  };

  const employerAvg = sectorAverages[claim.employerName] || 12;
  const overallAvg = 14;

  const percentile = Math.min(95, Math.max(5, Math.round((daysInProcess / overallAvg) * 50)));

  return {
    averageDays: overallAvg,
    percentileFaster: percentile,
    employerAverage: employerAvg,
    employerRank: employerAvg <= 10 ? 'Top 30%' : employerAvg <= 14 ? 'Average' : 'Bottom 40%',
    regionSpeed: employerAvg <= 10 ? 'fast' : employerAvg <= 14 ? 'normal' : 'slow',
    regionName: 'Bangalore',
    stageAverage: {
      employerApproval: 4,
      kycVerification: 3,
      epfoSanction: 4,
      paymentProcessing: 3,
    },
    totalClaims: 24853,
  };
}

export default function PeerComparison({ claim }: PeerComparisonProps) {
  const { t } = useLanguage();
  const daysInProcess = differenceInDays(new Date(), claim.filingDate);
  const peerData = getMockPeerData(claim);

  const isSlower = daysInProcess > peerData.averageDays;
  const barPosition = Math.min(95, Math.max(5, (daysInProcess / (peerData.averageDays * 2)) * 100));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          {t('peer_comparison_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar Comparison */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Fast (5 days)</span>
            <span>Average ({peerData.averageDays} days)</span>
            <span>Slow (25+ days)</span>
          </div>
          <div className="relative h-6 bg-gradient-to-r from-green-100 via-amber-100 to-red-100 rounded-full overflow-hidden">
            {/* Average marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
              style={{ left: '50%' }}
            />
            {/* Your claim marker */}
            <div
              className="absolute top-0.5 bottom-0.5 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-md z-20 flex items-center justify-center"
              style={{ left: `${barPosition}%`, transform: 'translateX(-50%)' }}
            >
              <span className="text-[8px] text-white font-bold">YOU</span>
            </div>
          </div>
          <p className="text-sm text-center">
            {isSlower ? (
              <span className="text-red-700">
                {t('peer_slower_than_avg')
                  .replace('{days}', String(daysInProcess))
                  .replace('{avg}', String(peerData.averageDays))}
              </span>
            ) : (
              <span className="text-green-700">
                {t('peer_faster_than_avg')
                  .replace('{days}', String(daysInProcess))
                  .replace('{avg}', String(peerData.averageDays))}
              </span>
            )}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 bg-gray-50 border">
            <div className="flex items-center gap-1 mb-1">
              <Building2 className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Employer Speed</span>
            </div>
            <p className="text-sm font-semibold">{peerData.employerAverage} days avg</p>
            <Badge variant="outline" className="text-xs mt-1">
              {peerData.employerRank}
            </Badge>
          </div>
          <div className="rounded-lg p-3 bg-gray-50 border">
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{peerData.regionName} EPFO</span>
            </div>
            <p className="text-sm font-semibold capitalize">{peerData.regionSpeed} speed</p>
            <Badge variant="outline" className="text-xs mt-1">
              No unusual delays
            </Badge>
          </div>
        </div>

        {/* Stage Averages */}
        <div className="text-xs space-y-1.5">
          <p className="font-medium text-sm">Typical Stage Duration</p>
          {Object.entries(peerData.stageAverage).map(([stage, days]) => {
            const labels: Record<string, string> = {
              employerApproval: 'Employer Approval',
              kycVerification: t('stage_kyc_plain'),
              epfoSanction: 'EPFO Sanction',
              paymentProcessing: 'Payment Processing',
            };
            const isCurrentStage = stage === claim.currentStage;
            return (
              <div key={stage} className={`flex justify-between items-center py-1 px-2 rounded ${isCurrentStage ? 'bg-primary-50 font-medium' : ''}`}>
                <span>{labels[stage]}</span>
                <span>{days} days {isCurrentStage && '(you are here)'}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          {t('analytics_mock_data')}
        </p>
      </CardContent>
    </Card>
  );
}
