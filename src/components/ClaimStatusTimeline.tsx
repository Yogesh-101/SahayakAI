'use client';

import { CheckCircle2, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ClaimStages } from '@/types/claim';
import { STAGE_ORDER, STAGE_LABELS, STAGE_LABELS_HI } from '@/types/claim';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';

interface ClaimStatusTimelineProps {
  stages: ClaimStages;
  currentStage: keyof ClaimStages;
}

export default function ClaimStatusTimeline({
  stages,
}: ClaimStatusTimelineProps) {
  const { language, t } = useLanguage();
  const labels = language === 'hi' ? STAGE_LABELS_HI : STAGE_LABELS;

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      completed: t('timeline_status_completed'),
      in_progress: t('timeline_status_in_progress'),
      pending: t('timeline_status_pending'),
      blocked: t('timeline_status_blocked'),
    };
    return map[status] ?? status;
  };

  const statusConfig = (status: string) => {
    const configs = {
      completed: {
        icon: CheckCircle2,
        color: 'text-secondary',
        bg: 'bg-secondary',
        badgeVariant: 'secondary' as const,
        ringColor: 'ring-secondary-200',
      },
      in_progress: {
        icon: Loader2,
        color: 'text-primary',
        bg: 'bg-primary',
        badgeVariant: 'default' as const,
        ringColor: 'ring-primary-200',
      },
      pending: {
        icon: Clock,
        color: 'text-gray-400',
        bg: 'bg-gray-300',
        badgeVariant: 'outline' as const,
        ringColor: 'ring-gray-200',
      },
      blocked: {
        icon: AlertTriangle,
        color: 'text-danger',
        bg: 'bg-danger',
        badgeVariant: 'destructive' as const,
        ringColor: 'ring-danger-200',
      },
    };
    return configs[status as keyof typeof configs] ?? configs.pending;
  };

  const mobileTimeText = (status: string, stage: ClaimStages[keyof ClaimStages]) => {
    if (status === 'completed' && stage.completedAt) {
      return t('timeline_completed_at').replace(
        '{time}',
        formatDistanceToNow(new Date(stage.completedAt), { addSuffix: true }),
      );
    }
    if (status === 'pending') return t('timeline_waiting_prev');
    return t('timeline_started_at').replace(
      '{time}',
      formatDistanceToNow(new Date(stage.enteredAt), { addSuffix: true }),
    );
  };

  return (
    <div className="w-full">
      <div className="hidden md:flex items-start justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />

        {STAGE_ORDER.map((key, idx) => {
          const stage = stages[key];
          const cfg = statusConfig(stage.status);
          const Icon = cfg.icon;
          const isLast = idx === STAGE_ORDER.length - 1;

          return (
            <div
              key={key}
              className={`flex flex-col items-center relative z-10 ${isLast ? '' : 'flex-1'}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ${cfg.ringColor} ${cfg.bg} text-white`}
              >
                <Icon
                  className={`w-5 h-5 ${stage.status === 'in_progress' ? 'animate-spin' : ''}`}
                />
              </div>

              <span className="text-xs font-medium mt-2 text-center max-w-[100px]">
                {labels[key]}
              </span>

              <Badge variant={cfg.badgeVariant} className="mt-1 text-[10px]">
                {statusLabel(stage.status)}
              </Badge>

              <span className="text-[10px] text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(stage.enteredAt), { addSuffix: false })}
              </span>

              {stage.blockerReason && (
                <span className="text-[10px] text-danger mt-1 text-center max-w-[120px]">
                  {stage.blockerReason}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="md:hidden space-y-0">
        {STAGE_ORDER.map((key, idx) => {
          const stage = stages[key];
          const cfg = statusConfig(stage.status);
          const Icon = cfg.icon;
          const isLast = idx === STAGE_ORDER.length - 1;

          return (
            <div key={key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ${cfg.ringColor} ${cfg.bg} text-white shrink-0`}
                >
                  <Icon
                    className={`w-5 h-5 ${stage.status === 'in_progress' ? 'animate-spin' : ''}`}
                  />
                </div>
                {!isLast && <div className="w-0.5 h-full min-h-[40px] bg-gray-200" />}
              </div>

              <div className="pb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{labels[key]}</span>
                  <Badge variant={cfg.badgeVariant} className="text-[10px]">
                    {statusLabel(stage.status)}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {mobileTimeText(stage.status, stage)}
                </p>

                {stage.blockerReason && (
                  <p className="text-xs text-danger mt-1 bg-danger-50 rounded px-2 py-1">
                    ⚠️ {stage.blockerReason}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
