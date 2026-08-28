'use client';

import { IndianRupee, TrendingDown, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ClaimStatus } from '@/types/claim';
import { differenceInDays } from 'date-fns';

interface FinancialImpactProps {
  claim: ClaimStatus;
}

interface ImpactBreakdown {
  lostFDInterest: number;
  lostMFReturns: number;
  inflationLoss: number;
  totalLoss: number;
  dailyLoss: number;
  projectedLossIn30Days: number;
}

function calculateImpact(amount: number, daysDelayed: number): ImpactBreakdown {
  const fdRate = 0.07; // 7% FD rate
  const mfRate = 0.12; // 12% MF rate
  const inflationRate = 0.06; // 6% inflation

  const lostFDInterest = Math.round((amount * fdRate * daysDelayed) / 365);
  const lostMFReturns = Math.round((amount * mfRate * daysDelayed) / 365);
  const inflationLoss = Math.round((amount * inflationRate * daysDelayed) / 365);
  const totalLoss = lostFDInterest + inflationLoss;
  const dailyLoss = Math.round(totalLoss / daysDelayed);
  const projectedLossIn30Days = Math.round((amount * (fdRate + inflationRate) * 30) / 365);

  return { lostFDInterest, lostMFReturns, inflationLoss, totalLoss, dailyLoss, projectedLossIn30Days };
}

export default function FinancialImpact({ claim }: FinancialImpactProps) {
  const daysDelayed = differenceInDays(new Date(), claim.filingDate);
  const impact = calculateImpact(claim.amount, daysDelayed);

  return (
    <Card className="border-amber-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-amber-600" />
            Financial Impact of Delay
          </CardTitle>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            {daysDelayed} days delayed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Loss Highlight */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-xs text-red-600 mb-1">You are losing every day this claim is delayed</p>
          <p className="text-3xl font-bold text-red-800">
            Rs {impact.totalLoss.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Total opportunity cost so far ({daysDelayed} days)
          </p>
        </div>

        {/* Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span className="text-sm">Lost Fixed Deposit interest (7% p.a.)</span>
            </div>
            <span className="text-sm font-semibold text-red-700">
              Rs {impact.lostFDInterest.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-amber-500" />
              <span className="text-sm">Inflation erosion (6% p.a.)</span>
            </div>
            <span className="text-sm font-semibold text-amber-700">
              Rs {impact.inflationLoss.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-gray-500" />
              <span className="text-sm">Could have earned in Mutual Fund (12% p.a.)</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Rs {impact.lostMFReturns.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Daily Rate */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center border">
            <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-lg font-bold">Rs {impact.dailyLoss}/day</p>
            <p className="text-[10px] text-muted-foreground">You are losing daily</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center border">
            <AlertCircle className="w-4 h-4 mx-auto text-red-500 mb-1" />
            <p className="text-lg font-bold">Rs {impact.projectedLossIn30Days.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-muted-foreground">If delayed 30 days total</p>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Calculated on claim amount of Rs {claim.amount.toLocaleString('en-IN')} |
          Based on current FD rates and CPI inflation data
        </p>
      </CardContent>
    </Card>
  );
}
