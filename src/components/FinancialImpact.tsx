'use client';

import Link from 'next/link';
import { IndianRupee, TrendingDown, AlertCircle, Clock, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ClaimStatus } from '@/types/claim';
import { differenceInDays } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

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
  const fdRate = 0.07;
  const mfRate = 0.12;
  const inflationRate = 0.06;
  const safeDays = Math.max(daysDelayed, 1);

  const lostFDInterest = Math.round((amount * fdRate * daysDelayed) / 365);
  const lostMFReturns = Math.round((amount * mfRate * daysDelayed) / 365);
  const inflationLoss = Math.round((amount * inflationRate * daysDelayed) / 365);
  const totalLoss = lostFDInterest + inflationLoss;
  const dailyLoss = Math.round(totalLoss / safeDays);
  const projectedLossIn30Days = Math.round((amount * (fdRate + inflationRate) * 30) / 365);

  return { lostFDInterest, lostMFReturns, inflationLoss, totalLoss, dailyLoss, projectedLossIn30Days };
}

export default function FinancialImpact({ claim }: FinancialImpactProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const daysDelayed = differenceInDays(new Date(), claim.filingDate);
  const impact = calculateImpact(claim.amount, daysDelayed);

  const shareWithEmployer = async () => {
    const text = `My EPFO claim (UAN: ${claim.uan}, ₹${claim.amount.toLocaleString('en-IN')}) has been delayed ${daysDelayed} days. Estimated daily loss: ₹${impact.dailyLoss}. Please expedite approval.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'EPFO Claim Delay', text });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: t('copied_title'), description: t('copied_status') });
    }
  };

  return (
    <Card className="border-amber-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-amber-600" />
            {t('finance_title')}
          </CardTitle>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            {t('finance_days_delayed').replace('{days}', String(daysDelayed))}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 text-center">
          <p className="text-xs text-red-600 mb-1">{t('finance_daily_loss_label')}</p>
          <p className="text-4xl sm:text-5xl font-bold text-red-800">
            ₹{impact.dailyLoss}
            <span className="text-lg font-medium">/day</span>
          </p>
        </div>

        <div className="bg-red-50/60 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-xs text-red-600 mb-1">{t('finance_losing_daily')}</p>
          <p className="text-2xl font-bold text-red-800">
            ₹{impact.totalLoss.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-red-600 mt-1">
            {t('finance_total_loss_label')} ({daysDelayed} days)
          </p>
        </div>

        <div className="space-y-2">
          {[
            { icon: TrendingDown, color: 'text-red-500', label: t('finance_fd_loss'), value: impact.lostFDInterest },
            { icon: TrendingDown, color: 'text-amber-500', label: t('finance_inflation'), value: impact.inflationLoss },
            { icon: TrendingDown, color: 'text-gray-500', label: t('finance_mf'), value: impact.lostMFReturns },
          ].map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b">
              <div className="flex items-center gap-2">
                <Icon className={`w-3 h-3 ${color}`} />
                <span className="text-sm">{label}</span>
              </div>
              <span className="text-sm font-semibold">₹{value.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center border min-h-[80px] flex flex-col justify-center">
            <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-lg font-bold">₹{impact.dailyLoss}/day</p>
            <p className="text-[10px] text-muted-foreground">{t('finance_daily_loss_label')}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center border min-h-[80px] flex flex-col justify-center">
            <AlertCircle className="w-4 h-4 mx-auto text-red-500 mb-1" />
            <p className="text-lg font-bold">₹{impact.projectedLossIn30Days.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-muted-foreground">{t('finance_if_30_days')}</p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 min-h-[44px]"
          onClick={shareWithEmployer}
        >
          <Share2 className="w-4 h-4" />
          {t('finance_share_employer')}
        </Button>

        {daysDelayed >= 7 && (
          <Link
            href={`/claim/${claim.uan}/rights`}
            className="block text-center text-xs text-indigo-700 hover:underline font-medium"
          >
            {t('finance_cites_link')} → {t('finance_view_rights')}
          </Link>
        )}

        <p className="text-[10px] text-muted-foreground text-center">
          {t('finance_footnote').replace('{amount}', claim.amount.toLocaleString('en-IN'))}
        </p>
      </CardContent>
    </Card>
  );
}
