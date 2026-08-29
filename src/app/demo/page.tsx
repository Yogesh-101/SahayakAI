'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, ArrowLeft, Compass, Map, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BeforeAfterComparison from '@/components/BeforeAfterComparison';
import GovPageShell from '@/components/GovPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { DEMO_STEP_DEFS } from '@/lib/demo-steps';

function replaceTokens(template: string, tokens: Record<string, string | number>) {
  return Object.entries(tokens).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );
}

export default function DemoPage() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [guidedMode, setGuidedMode] = useState(false);
  const step = DEMO_STEP_DEFS[currentStep];
  const totalSteps = DEMO_STEP_DEFS.length;
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);

  useEffect(() => {
    if (!guidedMode || currentStep >= totalSteps - 1) return;
    const timer = window.setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [guidedMode, currentStep, totalSteps]);

  return (
    <GovPageShell breadcrumbs={[{ label: t('footer_interactive_demo') }]}>
      <div className="container mx-auto px-4 py-8 pb-16">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <p className="text-sm font-semibold text-[#1a237e]">
              {replaceTokens(t('demo_step_of'), { current: currentStep + 1, total: totalSteps })}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuidedMode(true)}
                className={cn('tab-pill text-xs gap-1.5', guidedMode ? 'tab-pill-active' : 'tab-pill-inactive')}
              >
                <Compass className="w-3.5 h-3.5" />
                {t('demo_guided')}
              </button>
              <button
                type="button"
                onClick={() => setGuidedMode(false)}
                className={cn('tab-pill text-xs gap-1.5', !guidedMode ? 'tab-pill-active' : 'tab-pill-inactive')}
              >
                <Map className="w-3.5 h-3.5" />
                {t('demo_explore')}
              </button>
            </div>
          </div>
          {guidedMode && (
            <p className="text-xs text-muted-foreground mb-3">{t('demo_guided_hint')}</p>
          )}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              {replaceTokens(t('demo_percent'), { percent })}
            </p>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-epfo-indigo to-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-5">
          <Card className="gov-card-elevated">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl sm:text-3xl text-[#1a237e]">
                    {t(step.titleKey)}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {t(step.descKey)}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0 border-epfo-indigo/30 text-epfo-indigo">
                  {currentStep + 1}/{totalSteps}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {step.component === 'comparison' && <BeforeAfterComparison />}

              {step.demoUANs && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[#1a237e]">{t('demo_try_uans')}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {step.demoUANs.map((demo) => (
                      <Link
                        key={demo.uan}
                        href={`/claim/${demo.uan}/timeline`}
                        className="demo-list-item group border-gray-200"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="demo-uan-icon shrink-0">
                            <Hash className="w-3.5 h-3.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-mono font-semibold text-sm text-[#1a237e]">{demo.uan}</p>
                            <p className="text-xs text-muted-foreground truncate">{t(demo.labelKey)}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-epfo-indigo group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {step.noteKey && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Map className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-800">{t(step.noteKey)}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('demo_previous')}
                </Button>

                {step.link ? (
                  <Link href={step.link}>
                    <Button variant="gov">
                      <Play className="w-4 h-4" />
                      {t(step.actionKey)}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="gov"
                    onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
                    disabled={currentStep === totalSteps - 1}
                  >
                    {t('demo_next')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card-elevated bg-gray-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#1a237e]">{t('demo_quick_nav')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {DEMO_STEP_DEFS.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentStep(idx)}
                    className={cn(
                      'tab-pill text-xs max-w-full truncate',
                      idx === currentStep ? 'tab-pill-active' : 'tab-pill-inactive',
                    )}
                  >
                    {idx + 1}. {t(s.shortKey)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="rounded-xl border-2 border-epfo-indigo/30 bg-indigo-50/50 p-6">
            <p className="text-sm font-bold text-[#1a237e] mb-3">{t('demo_judge_title')}</p>
            <ul className="text-sm text-[#1a237e]/80 space-y-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <li key={n} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-epfo-indigo text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {n}
                  </span>
                  <span>{t(`demo_judge_${n}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </GovPageShell>
  );
}
