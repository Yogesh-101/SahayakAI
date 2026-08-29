'use client';

import { ShieldCheck, ShieldAlert, ShieldX, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { KYCHealthResult } from '@/lib/services/kyc-validator';

interface KYCHealthScoreProps {
  result: KYCHealthResult;
}

export default function KYCHealthScore({ result }: KYCHealthScoreProps) {
  const { t } = useLanguage();

  const statusConfig = {
    green: {
      icon: ShieldCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      labelKey: 'kyc_label_ready',
      recKey: 'kyc_rec_green',
    },
    yellow: {
      icon: ShieldAlert,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      labelKey: 'kyc_label_minor',
      recKey: 'kyc_rec_yellow',
    },
    red: {
      icon: ShieldX,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      labelKey: 'kyc_label_critical',
      recKey: 'kyc_rec_red',
    },
  };

  const config = statusConfig[result.status];
  const Icon = config.icon;
  const recommendation =
    result.status === 'green'
      ? t(config.recKey)
      : t(config.recKey).replace('{days}', String(result.estimatedDelayIfFiled));

  return (
    <div className="space-y-6">
      <div className={`rounded-xl p-6 ${config.bg} ${config.border} border-2 text-center`}>
        <Icon className={`w-16 h-16 mx-auto mb-3 ${config.color}`} />
        <div className="text-4xl font-bold mb-1">{result.score}%</div>
        <Badge className={`${config.bg} ${config.color} border ${config.border} text-sm px-3 py-1`}>
          {t(config.labelKey)}
        </Badge>
        <p className="mt-3 text-sm text-gray-700 max-w-md mx-auto">{recommendation}</p>
      </div>

      {result.status !== 'green' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg p-4 bg-red-50 border border-red-200 text-center">
            <p className="text-xs text-red-700 mb-1">{t('kyc_if_file_now')}</p>
            <p className="text-2xl font-bold text-red-800">{result.estimatedDelayIfFiled + 7}+ days</p>
            <p className="text-xs text-red-600">{t('kyc_expected_settlement')}</p>
          </div>
          <div className="rounded-lg p-4 bg-green-50 border border-green-200 text-center">
            <p className="text-xs text-green-700 mb-1">{t('kyc_if_fix_first')}</p>
            <p className="text-2xl font-bold text-green-800">{result.estimatedSettlementIfFixed} days</p>
            <p className="text-xs text-green-600">{t('kyc_expected_settlement')}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-sm">{t('kyc_detailed_results')}</h3>
        {result.fields.map((field, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 border ${
              field.severity === 'ok' ? 'border-green-200 bg-green-50/50' :
              field.severity === 'warning' ? 'border-amber-200 bg-amber-50/50' :
              'border-red-200 bg-red-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{field.field}</span>
              <Badge variant={field.match ? 'secondary' : 'destructive'} className="text-xs">
                {field.match ? t('kyc_pass') : t('kyc_fail')}
              </Badge>
            </div>
            {!field.match && (
              <div className="text-xs space-y-1 mt-2">
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16">{field.source1.name}:</span>
                  <span className="font-mono bg-white px-1 rounded">{field.source1.value}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16">{field.source2.name}:</span>
                  <span className="font-mono bg-white px-1 rounded">{field.source2.value}</span>
                </div>
                {field.fixUrl && (
                  <a
                    href={field.fixUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {field.fixLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
